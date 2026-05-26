package com.looteria.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.looteria.dto.ListingDetailDTO;
import com.looteria.entity.Image;
import com.looteria.entity.ListingPost;
import com.looteria.repository.ImageRepository;
import com.looteria.repository.ListingPostRepository;
import com.looteria.repository.TransactionRepository;
import com.looteria.repository.ExchangeRepository;
import com.looteria.repository.ReviewRepository;
import com.looteria.repository.VerificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@Service
@Transactional
public class ListingAdminService {

    @Autowired
    private ListingPostRepository listingPostRepository;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private ExchangeRepository exchangeRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private VerificationRepository verificationRepository;

    @Autowired
    private Cloudinary cloudinary;

    /**
     * Obtener todas las publicaciones 
     */
    public List<ListingDetailDTO> getAllListingsForAdmin() {
        List<ListingPost> listings = listingPostRepository.findAll();
        List<ListingDetailDTO> results = new ArrayList<>();
        for (ListingPost listing : listings) {
            results.add(convertToDTO(listing));
        }
        return results;
    }

    /**
     * Obtener publicaciones de un usuario específico
     */
    public List<ListingDetailDTO> getListingsByUserId(Long userId) {
        List<ListingPost> listings = listingPostRepository.findAll();
        List<ListingDetailDTO> results = new ArrayList<>();
        for (ListingPost listing : listings) {
            if (listing.getUsuario() != null && listing.getUsuario().getIdUsuario().equals(userId)) {
                results.add(convertToDTO(listing));
            }
        }
        return results;
    }

    /**
     * Eliminar publicación por ID
     */
    public void deleteListing(Long id) {
        ListingPost listing = listingPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Publicación no encontrada"));
        
        // Eliminar transacciones relacionadas
        Iterable<com.looteria.entity.Transaction> transactions = transactionRepository.findByPublicacion_IdPublicacion(id);
        transactionRepository.deleteAll(transactions);
        
        // Eliminar intercambios relacionados
        Iterable<com.looteria.entity.Exchange> exchanges = exchangeRepository.findByPublicacion_IdPublicacion(id);
        exchangeRepository.deleteAll(exchanges);
        
        // Eliminar reseñas relacionadas
        List<com.looteria.entity.Review> reviews = reviewRepository.findByPublicacion_IdPublicacion(id);
        reviewRepository.deleteAll(reviews);
        
        // Eliminar verificaciones relacionadas
        Iterable<com.looteria.entity.Verification> verifications = verificationRepository.findByPublicacion_IdPublicacion(id);
        verificationRepository.deleteAll(verifications);
        
        // Eliminar imágenes de Cloudinary
        List<Image> images = (List<Image>) imageRepository.findByPublicacion_IdPublicacion(id);
        for (Image image : images) {
            if (image.getPublicId() != null) {
                try {
                    cloudinary.uploader().destroy(image.getPublicId(), ObjectUtils.emptyMap());
                } catch (IOException e) {
                    System.err.println("Error deleting image from Cloudinary: " + e.getMessage());
                }
            }
        }
        
        // Eliminar imágenes de la base de datos
        imageRepository.deleteAll(images);
        
        // Eliminar publicación
        listingPostRepository.delete(listing);
    }

    /**
     * Obtener publicación por ID como DTO
     */
    public ListingDetailDTO getListingById(Long id) {
        return listingPostRepository.findById(id)
                .map(this::convertToDTO)
                .orElse(null);
    }

    /**
     * Convertir entidad ListingPost a DTO
     */
    private ListingDetailDTO convertToDTO(ListingPost listing) {
        ListingDetailDTO dto = new ListingDetailDTO();
        
        try {
            dto.setIdPublicacion(listing.getIdPublicacion());
            
            if (listing.getUsuario() != null) {
                dto.setIdUsuario(listing.getUsuario().getIdUsuario());
                dto.setNombreUsuario(listing.getUsuario().getNombreUsuario());
                dto.setEmail(listing.getUsuario().getEmail());
            } else {
                dto.setIdUsuario(null);
                dto.setNombreUsuario("Desconocido");
                dto.setEmail("Desconocido");
            }
            
            dto.setTitulo(listing.getTitulo() != null ? listing.getTitulo() : "");
            dto.setDescripcion(listing.getDescripcion() != null ? listing.getDescripcion() : "");
            dto.setPlataforma(listing.getPlataforma() != null ? listing.getPlataforma().getNombre() : "Desconocida");
            dto.setTipoArticulo(listing.getTipoArticulo() != null ? listing.getTipoArticulo().getNombre() : "No especificado");
            
            if (listing.getTipoTransaccion() != null) {
                dto.setTipoTransaccion(listing.getTipoTransaccion().toString());
            } else {
                dto.setTipoTransaccion("DESCONOCIDO");
            }
            
            dto.setPrecio(listing.getPrecio());
            
            if (listing.getEstadoArticulo() != null) {
                dto.setEstadoArticulo(listing.getEstadoArticulo().getNombre());
            } else {
                dto.setEstadoArticulo("No especificado");
            }
            
            dto.setDescripcionEstado(listing.getDescripcionEstado());
            
            if (listing.getIdioma() != null) {
                dto.setIdioma(listing.getIdioma().getNombre());
            } else {
                dto.setIdioma("Desconocido");
            }
            
            if (listing.getRegion() != null) {
                dto.setRegion(listing.getRegion().getNombre());
            } else {
                dto.setRegion("Desconocida");
            }
            
            dto.setFechaCreacion(listing.getFechaCreacion());
            
            if (listing.getEstadoPublicacion() != null) {
                dto.setEstadoPublicacion(listing.getEstadoPublicacion().toString());
            } else {
                dto.setEstadoPublicacion("DESCONOCIDO");
            }

            dto.setDestacado(listing.getDestacado() != null ? listing.getDestacado() : false);

            // Poblar imágenes
            List<Image> images = (List<Image>) imageRepository.findByPublicacion_IdPublicacion(listing.getIdPublicacion());
            List<String> imageUrls = images.stream()
                    .map(Image::getRutaImagen)
                    .collect(Collectors.toList());
            dto.setImagenes(imageUrls);
        } catch (Exception e) {
            // Log silenciosamente si hay errores
            e.printStackTrace();
        }

        return dto;
    }
}
