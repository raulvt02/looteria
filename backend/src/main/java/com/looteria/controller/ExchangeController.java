package com.looteria.controller;

import com.looteria.dto.CreateExchangeRequestDTO;
import com.looteria.dto.ExchangeDTO;
import com.looteria.service.ExchangeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/intercambios")
public class ExchangeController {

    @Autowired
    private ExchangeService exchangeService;

    // ─── Crear propuesta de intercambio ──────────────────────────────────────────

    @PostMapping
    public ResponseEntity<?> createExchange(@RequestBody CreateExchangeRequestDTO request) {
        try {
            ExchangeDTO exchange = exchangeService.createExchange(
                    request.getPublicacionId(),
                    request.getSolicitanteId(),
                    request.getMensaje()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(exchange);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    // ─── Obtener intercambio por ID ──────────────────────────────────────────────

    @GetMapping("/{id}")
    public ResponseEntity<?> getExchangeById(@PathVariable Long id) {
        try {
            Optional<ExchangeDTO> exchange = exchangeService.getExchangeById(id);
            if (exchange.isPresent()) {
                return ResponseEntity.ok(exchange.get());
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("Intercambio no encontrado"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    // ─── Obtener intercambios que el usuario solicitó ───────────────────────────

    @GetMapping("/solicitante/{solicitanteId}")
    public ResponseEntity<?> getExchangesBySolicitante(@PathVariable Long solicitanteId) {
        try {
            List<ExchangeDTO> exchanges = exchangeService.getExchangesBySolicitante(solicitanteId);
            return ResponseEntity.ok(exchanges);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    // ─── Obtener intercambios que el usuario recibió ───────────────────────────

    @GetMapping("/solicitado/{solicitadoId}")
    public ResponseEntity<?> getExchangesBySolicitado(@PathVariable Long solicitadoId) {
        try {
            List<ExchangeDTO> exchanges = exchangeService.getExchangesBySolicitado(solicitadoId);
            return ResponseEntity.ok(exchanges);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    // ─── Obtener intercambios de una publicación ─────────────────────────────────

    @GetMapping("/publicacion/{publicacionId}")
    public ResponseEntity<?> getExchangesByPublicacion(@PathVariable Long publicacionId) {
        try {
            List<ExchangeDTO> exchanges = exchangeService.getExchangesByPublicacion(publicacionId);
            return ResponseEntity.ok(exchanges);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    // ─── Actualizar estado de intercambio (aceptar/rechazar/cancelar) ────────────

    @PutMapping("/{id}/estado")
    public ResponseEntity<?> updateExchangeStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest request) {
        try {
            ExchangeDTO exchange = exchangeService.updateExchangeStatus(id, request.getEstado());
            return ResponseEntity.ok(exchange);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    // ─── Marcar intercambio como completado por un usuario ───────────────────────

    @PutMapping("/{id}/completar")
    public ResponseEntity<?> marcarCompletado(@PathVariable Long id, @RequestBody CompletarRequest request) {
        try {
            ExchangeDTO exchange = exchangeService.marcarCompletado(id, request.getUserId());
            return ResponseEntity.ok(exchange);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    // ─── Response / Request classes ──────────────────────────────────────────────

    static class ErrorResponse {
        public String error;

        public ErrorResponse(String error) {
            this.error = error;
        }
    }

    static class StatusUpdateRequest {
        private String estado;

        public String getEstado() {
            return estado;
        }

        public void setEstado(String estado) {
            this.estado = estado;
        }
    }

    static class CompletarRequest {
        private Long userId;

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }
    }
}
