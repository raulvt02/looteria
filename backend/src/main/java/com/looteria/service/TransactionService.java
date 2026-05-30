package com.looteria.service;

import com.looteria.dto.TransactionDTO;
import com.looteria.entity.ListingPost;
import com.looteria.entity.Review;
import com.looteria.entity.Transaction;
import com.looteria.entity.Verification;
import com.looteria.entity.User;
import com.looteria.repository.ListingPostRepository;
import com.looteria.repository.ReviewRepository;
import com.looteria.repository.TransactionRepository;
import com.looteria.repository.VerificationRepository;
import com.looteria.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private ListingPostRepository listingPostRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private VerificationRepository verificationRepository;

    @Transactional
    public TransactionDTO createTransaction(Long publicacionId, Long compradorId, Long vendedorId,
                                        String tipo, BigDecimal precioFinal) {
        ListingPost listing = listingPostRepository.findById(publicacionId)
                .orElseThrow(() -> new RuntimeException("Publicación no encontrada"));

        User comprador = userRepository.findById(compradorId)
                .orElseThrow(() -> new RuntimeException("Comprador no encontrado"));

        User vendedor = userRepository.findById(vendedorId)
                .orElseThrow(() -> new RuntimeException("Vendedor no encontrado"));

        Transaction transaction = new Transaction();
        transaction.setPublicacion(listing);
        transaction.setComprador(comprador);
        transaction.setVendedor(vendedor);
        transaction.setTipo(Transaction.TransactionType.valueOf(tipo));
        transaction.setPrecioFinal(precioFinal);
        transaction.setEstado(Transaction.TransactionStatus.PENDIENTE);
        transaction.setFechaTransaccion(LocalDateTime.now());

       
        BigDecimal comision = precioFinal.multiply(new BigDecimal("0.10"));
        transaction.setComision(comision);

        Transaction savedTransaction = transactionRepository.save(transaction);

        // La publicación NO se marca como VENDIDA todavía
        // Se marcará cuando el vendedor confirme el envío (EN_TRANSITO)

        return mapToDTO(savedTransaction);
    }

    @Transactional(readOnly = true)
    public Optional<TransactionDTO> getTransactionById(Long id) {
        return transactionRepository.findById(id).map(this::mapToDTO);
    }

    @Transactional(readOnly = true)
    public List<TransactionDTO> getTransactionsByBuyer(Long buyerId) {
        return StreamSupport.stream(
                transactionRepository.findByComprador_IdUsuario(buyerId).spliterator(), false
        ).map(this::mapToDTO).toList();
    }

    @Transactional(readOnly = true)
    public List<TransactionDTO> getTransactionsBySeller(Long sellerId) {
        return StreamSupport.stream(
                transactionRepository.findByVendedor_IdUsuario(sellerId).spliterator(), false
        ).map(this::mapToDTO).toList();
    }

    @Transactional(readOnly = true)
    public List<TransactionDTO> getAllTransactions() {
        return StreamSupport.stream(
                transactionRepository.findAll().spliterator(), false
        ).map(this::mapToDTO).toList();
    }

    @Transactional
    public void deleteTransaction(Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transacción no encontrada"));

        Iterable<Verification> verifications = verificationRepository.findByTransaccion_IdTransaccion(transactionId);
        verificationRepository.deleteAll(verifications);

        Iterable<Review> reviews = reviewRepository.findByTransaccion_IdTransaccion(transactionId);
        reviewRepository.deleteAll(reviews);

        transactionRepository.delete(transaction);
    }

    @Transactional
    public TransactionDTO updateTransactionStatus(Long transactionId, String newStatus) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transacción no encontrada"));

        Transaction.TransactionStatus status = Transaction.TransactionStatus.valueOf(newStatus);
        transaction.setEstado(status);
        Transaction saved = transactionRepository.save(transaction);

        if (status == Transaction.TransactionStatus.COMPLETADA) {
            User vendedor = transaction.getVendedor();
            vendedor.setPuntosAcumulados(vendedor.getPuntosAcumulados() + 50L);
            userRepository.save(vendedor);
        }
        return mapToDTO(saved);
    }

    @Transactional(readOnly = true)
    public TransactionDTO mapToDTO(Transaction t) {
        TransactionDTO dto = new TransactionDTO();
        dto.setIdTransaccion(t.getIdTransaccion());
        dto.setPublicacionId(t.getPublicacion().getIdPublicacion());
        dto.setProductoTitulo(t.getPublicacion().getTitulo() != null ? t.getPublicacion().getTitulo() : "");
        dto.setCompradorId(t.getComprador().getIdUsuario());
        dto.setCompradorNombre(t.getComprador().getNombreUsuario());
        dto.setVendedorId(t.getVendedor().getIdUsuario());
        dto.setVendedorNombre(t.getVendedor().getNombreUsuario());
        dto.setTipo(t.getTipo().name());
        dto.setPrecioFinal(t.getPrecioFinal());
        dto.setComision(t.getComision());
        dto.setEstado(t.getEstado().name());
        dto.setFechaTransaccion(t.getFechaTransaccion());
        return dto;
    }
}
