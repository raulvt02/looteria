package com.looteria.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "intercambios")
public class Exchange {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idIntercambio;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_publicacion", nullable = false)
    private ListingPost publicacion;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_solicitante", nullable = false)
    private User solicitante;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_solicitado", nullable = false)
    private User solicitado;
    
    @Column(name = "mensaje", columnDefinition = "TEXT")
    private String mensaje;
    
    @Column(name = "estado", nullable = false)
    @Enumerated(EnumType.STRING)
    private ExchangeStatus estado = ExchangeStatus.PENDIENTE;

    @Column(name = "completado_por_solicitante")
    private Boolean completadoPorSolicitante = false;

    @Column(name = "completado_por_solicitado")
    private Boolean completadoPorSolicitado = false;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
    }

    public enum ExchangeStatus {
        PENDIENTE,
        ACEPTADA,
        RECHAZADA,
        CANCELADA,
        COMPLETADA
    }
}
