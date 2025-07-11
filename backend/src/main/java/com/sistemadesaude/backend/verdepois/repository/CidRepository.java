// src/main/java/com/sistemadesaude/backend/repository/CidRepository.java

package com.sistemadesaude.backend.verdepois.repository;

import com.sistemadesaude.backend.verdepois.model.Cid;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CidRepository extends JpaRepository<Cid, String> {
    List<Cid> findTop10ByCodigoContainingIgnoreCaseOrDescricaoContainingIgnoreCase(String codigo, String descricao);
}
