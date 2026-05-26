package com.looteria.repository;

import com.looteria.entity.Verification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VerificationRepository extends JpaRepository<Verification, Long> {
    
    Iterable<Verification> findByTransaccion_IdTransaccion(Long transaccionId);
    
    Iterable<Verification> findByEstado(Verification.VerificationStatus estado);
    
    Iterable<Verification> findByPublicacion_IdPublicacion(Long publicacionId);
}
