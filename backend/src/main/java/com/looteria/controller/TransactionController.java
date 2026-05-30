package com.looteria.controller;

import com.looteria.dto.CreateTransactionRequestDTO;
import com.looteria.dto.TransactionDTO;
import com.looteria.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/transacciones")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    // ─── Crear nueva transacción ─────────────────────────────────────────────────

    @PostMapping
    public ResponseEntity<?> createTransaction(@RequestBody CreateTransactionRequestDTO request) {
        try {
            System.out.println("=== Creando transacción ===");
            System.out.println("publicacionId: " + request.getPublicacionId());
            System.out.println("compradorId: " + request.getCompradorId());
            System.out.println("vendedorId: " + request.getVendedorId());
            System.out.println("tipo: " + request.getTipo());
            System.out.println("precioFinal: " + request.getPrecioFinal());
            TransactionDTO transaction = transactionService.createTransaction(
                    request.getPublicacionId(),
                    request.getCompradorId(),
                    request.getVendedorId(),
                    request.getTipo(),
                    request.getPrecioFinal()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(transaction);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    // ─── Obtener transacción por ID ──────────────────────────────────────────────

    @GetMapping("/{id}")
    public ResponseEntity<?> getTransactionById(@PathVariable Long id) {
        try {
            Optional<TransactionDTO> transaction = transactionService.getTransactionById(id);
            if (transaction.isPresent()) {
                return ResponseEntity.ok(transaction.get());
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("Transacción no encontrada"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    // ─── Obtener transacciones del comprador ─────────────────────────────────────

    @GetMapping("/comprador/{compradorId}")
    public ResponseEntity<?> getTransactionsByBuyer(@PathVariable Long compradorId) {
        try {
            List<TransactionDTO> transactions = transactionService.getTransactionsByBuyer(compradorId);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    // ─── Obtener transacciones del vendedor ──────────────────────────────────────

    @GetMapping("/vendedor/{vendedorId}")
    public ResponseEntity<?> getTransactionsBySeller(@PathVariable Long vendedorId) {
        try {
            List<TransactionDTO> transactions = transactionService.getTransactionsBySeller(vendedorId);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    // ─── Obtener todas las transacciones (admin) ─────────────────────────────────

    @GetMapping("/all")
    public ResponseEntity<?> getAllTransactions() {
        try {
            List<TransactionDTO> transactions = transactionService.getAllTransactions();
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    // ─── Actualizar estado de transacción ────────────────────────────────────────

    @PutMapping("/{id}/estado")
    public ResponseEntity<?> updateTransactionStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest request) {
        try {
            TransactionDTO transaction = transactionService.updateTransactionStatus(id, request.getEstado());
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    // ─── Response classes ────────────────────────────────────────────────────────

    static class ErrorResponse {
        public String error;

        public ErrorResponse(String error) {
            this.error = error;
        }
    }

    static class SuccessResponse {
        public String message;

        public SuccessResponse(String message) {
            this.message = message;
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
}
