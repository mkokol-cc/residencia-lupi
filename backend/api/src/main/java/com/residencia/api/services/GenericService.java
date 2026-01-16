package com.residencia.api.services;

import java.io.Serializable;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import jakarta.annotation.Nullable;

public abstract class GenericService<T, D, ID extends Serializable> {

    @Autowired
    private JpaRepository<T, ID> repository;

    public List<D> findAll() {
        return repository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Page<D> findAll(Pageable pageable) {
        return repository.findAll(pageable).map(this::toDTO);
    }

    public Optional<D> findById(ID id) {
        return repository.findById(id).map(this::toDTO);
    }

    public D save(D dto) {
        T entity = toEntity(dto);
        entity = repository.save(entity);
        return toDTO(entity);
    }

    public void deleteById(ID id) {
        repository.deleteById(id);
    }

    // Métodos abstractos para la conversión
    protected abstract D toDTO(T entity);
    protected abstract T toEntity(D dto);
    
    public <C> T addToCollection(
            ID parentId,
            Function<T, Collection<C>> collectionGetter,
            C child,
            @Nullable Consumer<C> parentSetter) {
        T parent = getRepository().findById(parentId)
                .orElseThrow(() -> new RuntimeException("Entidad padre no encontrada"));

        // Establecer la referencia al padre en el hijo, si aplica
        if (parentSetter != null) {
            parentSetter.accept(child);
        }

        // Añadir el hijo a la colección
        Collection<C> collection = collectionGetter.apply(parent);
        collection.add(child);

        // Guardar la entidad padre (cascada manejará el hijo)
        return getRepository().save(parent);
    }

    protected abstract JpaRepository<T, ID> getRepository();
}