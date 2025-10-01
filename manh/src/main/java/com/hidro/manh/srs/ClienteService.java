package com.hidro.manh.srs;

import com.hidro.manh.ety.Cliente;
import com.hidro.manh.rep.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    // Listado paginado de clientes con ubicaciones
    public Page<Cliente> getAllClientes(Pageable pageable) {
        return clienteRepository.findAllWithUbicaciones(pageable);
    }

    // Clientes filtrados por región
    public Page<Cliente> getClientesByRegion(Integer regionId, Pageable pageable) {
        return clienteRepository.findAllByRegion(regionId, pageable);
    }

    // Clientes filtrados por comuna
    public Page<Cliente> getClientesByComuna(Integer comunaId, Pageable pageable) {
        return clienteRepository.findAllByComuna(comunaId, pageable);
    }

    // Cliente específico por ID con sus ubicaciones
    public Optional<Cliente> getClienteById(Long idCliente) {
        return clienteRepository.findByIdWithUbicaciones(idCliente);
    }

    // Guardar o actualizar cliente
    public Cliente saveCliente(Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    // Eliminar cliente por ID
    public void deleteCliente(Long idCliente) {
        clienteRepository.deleteById(idCliente);
    }
}
