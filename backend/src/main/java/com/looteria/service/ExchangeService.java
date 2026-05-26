package com.looteria.service;

import com.looteria.dto.ExchangeDTO;
import com.looteria.entity.Exchange;
import com.looteria.entity.Image;
import com.looteria.entity.ListingPost;
import com.looteria.entity.User;
import com.looteria.repository.ExchangeRepository;
import com.looteria.repository.ImageRepository;
import com.looteria.repository.ListingPostRepository;
import com.looteria.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

@Service
public class ExchangeService {

    @Autowired
    private ExchangeRepository exchangeRepository;

    @Autowired
    private ListingPostRepository listingPostRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ImageRepository imageRepository;

    @Transactional
    public ExchangeDTO createExchange(Long publicacionId, Long solicitanteId, String mensaje) {
        ListingPost listing = listingPostRepository.findById(publicacionId)
                .orElseThrow(() -> new RuntimeException("Publicación no encontrada"));

        User solicitante = userRepository.findById(solicitanteId)
                .orElseThrow(() -> new RuntimeException("Usuario solicitante no encontrado"));

        User solicitado = listing.getUsuario();

        if (solicitante.getIdUsuario().equals(solicitado.getIdUsuario())) {
            throw new RuntimeException("No puedes solicitar un intercambio en tu propia publicación");
        }

        Exchange exchange = new Exchange();
        exchange.setPublicacion(listing);
        exchange.setSolicitante(solicitante);
        exchange.setSolicitado(solicitado);
        exchange.setMensaje(mensaje);
        exchange.setEstado(Exchange.ExchangeStatus.PENDIENTE);
        exchange.setFechaCreacion(LocalDateTime.now());

        return mapToDTO(exchangeRepository.save(exchange));
    }

    @Transactional(readOnly = true)
    public Optional<ExchangeDTO> getExchangeById(Long id) {
        return exchangeRepository.findById(id).map(this::mapToDTO);
    }

    @Transactional(readOnly = true)
    public List<ExchangeDTO> getExchangesBySolicitante(Long solicitanteId) {
        return StreamSupport.stream(
                exchangeRepository.findBySolicitante_IdUsuario(solicitanteId).spliterator(), false
        ).map(this::mapToDTO).toList();
    }

    @Transactional(readOnly = true)
    public List<ExchangeDTO> getExchangesBySolicitado(Long solicitadoId) {
        return StreamSupport.stream(
                exchangeRepository.findBySolicitado_IdUsuario(solicitadoId).spliterator(), false
        ).map(this::mapToDTO).toList();
    }

    @Transactional(readOnly = true)
    public List<ExchangeDTO> getExchangesByPublicacion(Long publicacionId) {
        return StreamSupport.stream(
                exchangeRepository.findByPublicacion_IdPublicacion(publicacionId).spliterator(), false
        ).map(this::mapToDTO).toList();
    }

    @Transactional
    public ExchangeDTO updateExchangeStatus(Long exchangeId, String newStatus) {
        Exchange exchange = exchangeRepository.findById(exchangeId)
                .orElseThrow(() -> new RuntimeException("Intercambio no encontrado"));

        exchange.setEstado(Exchange.ExchangeStatus.valueOf(newStatus));
        return mapToDTO(exchangeRepository.save(exchange));
    }

    // ─── Marcar intercambio como completado (ambos usuarios deben confirmar) ───
    @Transactional
    public ExchangeDTO marcarCompletado(Long exchangeId, Long userId) {
        Exchange exchange = exchangeRepository.findById(exchangeId)
                .orElseThrow(() -> new RuntimeException("Intercambio no encontrado"));

        if (exchange.getEstado() != Exchange.ExchangeStatus.ACEPTADA) {
            throw new RuntimeException("El intercambio debe estar ACEPTADA para poder marcarlo como completado");
        }

        Long solicitanteId = exchange.getSolicitante().getIdUsuario();
        Long solicitadoId = exchange.getSolicitado().getIdUsuario();

        if (userId.equals(solicitanteId)) {
            exchange.setCompletadoPorSolicitante(true);
        } else if (userId.equals(solicitadoId)) {
            exchange.setCompletadoPorSolicitado(true);
        } else {
            throw new RuntimeException("No tienes permiso para completar este intercambio");
        }

        if (Boolean.TRUE.equals(exchange.getCompletadoPorSolicitante())
                && Boolean.TRUE.equals(exchange.getCompletadoPorSolicitado())) {
            exchange.setEstado(Exchange.ExchangeStatus.COMPLETADA);

            User solicitante = exchange.getSolicitante();
            solicitante.setPuntosAcumulados(solicitante.getPuntosAcumulados() + 50L);
            userRepository.save(solicitante);

            User solicitado = exchange.getSolicitado();
            solicitado.setPuntosAcumulados(solicitado.getPuntosAcumulados() + 50L);
            userRepository.save(solicitado);
        }

        return mapToDTO(exchangeRepository.save(exchange));
    }

    private ExchangeDTO mapToDTO(Exchange e) {
        ExchangeDTO dto = new ExchangeDTO();
        dto.setIdIntercambio(e.getIdIntercambio());
        dto.setPublicacionId(e.getPublicacion().getIdPublicacion());
        dto.setPublicacionTitulo(e.getPublicacion().getTitulo() != null ? e.getPublicacion().getTitulo() : "");
        dto.setSolicitanteId(e.getSolicitante().getIdUsuario());
        dto.setSolicitanteNombre(e.getSolicitante().getNombreUsuario());
        dto.setSolicitadoId(e.getSolicitado().getIdUsuario());
        dto.setSolicitadoNombre(e.getSolicitado().getNombreUsuario());
        dto.setMensaje(e.getMensaje());
        dto.setEstado(e.getEstado().name());
        dto.setCompletadoPorSolicitante(Boolean.TRUE.equals(e.getCompletadoPorSolicitante()));
        dto.setCompletadoPorSolicitado(Boolean.TRUE.equals(e.getCompletadoPorSolicitado()));
        dto.setFechaCreacion(e.getFechaCreacion() != null ? e.getFechaCreacion().toString() : "");

        List<Image> imagenes = StreamSupport.stream(
                imageRepository.findByPublicacion_IdPublicacion(e.getPublicacion().getIdPublicacion()).spliterator(), false
        ).toList();
        if (!imagenes.isEmpty()) {
            dto.setPublicacionImagen(imagenes.get(0).getRutaImagen());
        }

        return dto;
    }
}
