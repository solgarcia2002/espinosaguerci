export interface ColppyProgressEvent {
  type: 'start' | 'progress' | 'complete' | 'error';
  scope: 'clientes' | 'proveedores' | 'pagos' | 'facturas' | 'movimientos' | 'todos';
  tenantId: string;
  current: number;
  total: number;
  message: string;
  timestamp: string;
}

export type ProgressCallback = (event: ColppyProgressEvent) => void;

class ColppyRpaService {
  private socket: WebSocket | null = null;
  private tenantId: string | null = null;
  private isConnected: boolean = false;
  private progressCallbacks: Set<ProgressCallback> = new Set();
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000;

  /**
   * Obtener el tenant ID desde localStorage o variable de entorno
   */
  private getTenantId(): string {
    if (typeof window === 'undefined') {
      return process.env.TENANT || 'd9d1c7f9-8909-4d43-a32b-278174459446';
    }
    
    // Intentar obtener desde localStorage o usar el default
    const storedTenantId = localStorage.getItem('tenant_id');
    if (storedTenantId) {
      return storedTenantId;
    }
    
    return process.env.TENANT || 'd9d1c7f9-8909-4d43-a32b-278174459446';
  }

  /**
   * Conectar al WebSocket del servidor (WebSocket nativo)
   */
  connect(): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      console.log('🔌 WebSocket ya está conectado');
      return;
    }

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'https://apicontador.empowerit.io';
    // Convertir HTTPS a WSS para WebSocket
    const wsProtocol = wsUrl.replace('https://', 'wss://').replace('http://', 'ws://');
    const wsEndpoint = `${wsProtocol}/colppy-progress`;
    
    console.log('🔌 Conectando a WebSocket:', wsEndpoint);
    
    try {
      this.socket = new WebSocket(wsEndpoint);
      this.tenantId = this.getTenantId();

      this.socket.onopen = () => {
        console.log('✅ WebSocket conectado');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        
        // Unirse al tenant automáticamente
        if (this.tenantId && this.socket) {
          console.log('🏢 Uniéndose al tenant:', this.tenantId);
          this.socket.send(JSON.stringify({
            type: 'join-tenant',
            tenantId: this.tenantId
          }));
        }
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // El backend puede enviar el evento directamente o envuelto
          let progressEvent: ColppyProgressEvent | null = null;
          
          if (data.type === 'colppy-progress') {
            // Si viene envuelto con type: 'colppy-progress'
            progressEvent = data as ColppyProgressEvent;
          } else if (data.scope && data.current !== undefined) {
            // Si viene directamente como objeto de progreso
            progressEvent = data as ColppyProgressEvent;
          }
          
          if (progressEvent) {
            console.log('[colppy-progress]', progressEvent);
            
            // Notificar a todos los callbacks registrados
            this.progressCallbacks.forEach(callback => {
              try {
                callback(progressEvent!);
              } catch (error) {
                console.error('Error en callback de progreso:', error);
              }
            });
          } else {
            console.log('[websocket] Mensaje recibido:', data);
          }
        } catch (error) {
          console.error('Error procesando mensaje WebSocket:', error);
        }
      };

      this.socket.onerror = (error) => {
        console.error('❌ Error de conexión WebSocket:', error);
        this.isConnected = false;
      };

      this.socket.onclose = (event) => {
        console.log('❌ WebSocket desconectado', event.code, event.reason);
        this.isConnected = false;
        
        // Intentar reconectar si no fue un cierre intencional
        if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          console.log(`🔄 Intentando reconectar (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
          setTimeout(() => {
            this.connect();
          }, this.reconnectDelay * this.reconnectAttempts);
        }
      };
    } catch (error) {
      console.error('❌ Error creando conexión WebSocket:', error);
      this.isConnected = false;
    }
  }

  /**
   * Desconectar del WebSocket
   */
  disconnect(): void {
    if (this.socket) {
      if (this.tenantId && this.socket.readyState === WebSocket.OPEN) {
        console.log('🏢 Dejando el tenant:', this.tenantId);
        this.socket.send(JSON.stringify({
          type: 'leave-tenant',
          tenantId: this.tenantId
        }));
      }
      
      this.socket.close(1000, 'Desconexión intencional');
      this.socket = null;
      this.isConnected = false;
      this.reconnectAttempts = 0;
      console.log('🔌 WebSocket desconectado');
    }
  }

  /**
   * Registrar un callback para recibir eventos de progreso
   */
  onProgress(callback: ProgressCallback): () => void {
    this.progressCallbacks.add(callback);
    
    // Retornar función para desregistrar
    return () => {
      this.progressCallbacks.delete(callback);
    };
  }

  /**
   * Verificar si está conectado
   */
  get connected(): boolean {
    return this.isConnected && this.socket?.readyState === WebSocket.OPEN;
  }

  /**
   * Obtener el socket (para uso avanzado)
   */
  getSocket(): WebSocket | null {
    return this.socket;
  }
}

// Singleton instance
export const colppyRpaService = new ColppyRpaService();

