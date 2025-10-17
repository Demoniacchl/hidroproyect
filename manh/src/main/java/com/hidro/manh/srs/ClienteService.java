package com.hidro.manh.srs;

import com.hidro.manh.ety.Cliente;
import com.hidro.manh.dto.ClienteDto;
import com.hidro.manh.map.ClienteMapper;
import com.hidro.manh.rep.ClienteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    public List<ClienteDto> getAllClients() {
        return clienteRepository.findAll()
                .stream()
                .map(ClienteMapper::toDTO)
                .toList();
    }

    public ClienteDto getClientById(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        return ClienteMapper.toDTO(cliente);
    }

    public ClienteDto createClient(ClienteDto clientDto) {
        // Validar que el ncliente no exista
        Optional<Cliente> existingCliente = clienteRepository.findByNcliente(clientDto.getNCliente());
        if (existingCliente.isPresent()) {
            throw new RuntimeException("Ya existe un cliente con el número: " + clientDto.getNCliente());
        }

        Cliente cliente = new Cliente();
        cliente.setNcliente(clientDto.getNCliente()); // ← Cambiado a getNcliente()
        cliente.setNombre1(clientDto.getNombre1());
        cliente.setNombre2(clientDto.getNombre2());
        cliente.setRut(clientDto.getRut());
        cliente.setTelefono1(clientDto.getTelefono1());
        cliente.setTelefono2(clientDto.getTelefono2());
        cliente.setCorreo(clientDto.getCorreo());
        cliente.setObservaciones(clientDto.getObservaciones());
        
        Cliente saved = clienteRepository.save(cliente);
        return ClienteMapper.toDTO(saved);
    }

    public ClienteDto updateClient(Long id, ClienteDto clientDto) {
        Cliente existing = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        // Validar si se está cambiando el ncliente
        if (!existing.getNcliente().equals(clientDto.getNCliente())) {
            Optional<Cliente> clienteConMismoNumero = clienteRepository.findByNcliente(clientDto.getNCliente());
            if (clienteConMismoNumero.isPresent() && !clienteConMismoNumero.get().getIdCliente().equals(id)) {
                throw new RuntimeException("Ya existe otro cliente con el número: " + clientDto.getNCliente());
            }
        }

        existing.setNcliente(clientDto.getNCliente()); // ← Cambiado a getNcliente()
        existing.setNombre1(clientDto.getNombre1());
        existing.setNombre2(clientDto.getNombre2());
        existing.setRut(clientDto.getRut());
        existing.setTelefono1(clientDto.getTelefono1());
        existing.setTelefono2(clientDto.getTelefono2());
        existing.setCorreo(clientDto.getCorreo());
        existing.setObservaciones(clientDto.getObservaciones());

        Cliente updated = clienteRepository.save(existing);
        return ClienteMapper.toDTO(updated);
    }

    public void deleteClient(Long id) {
        if (!clienteRepository.existsById(id)) {
            throw new RuntimeException("Cliente no encontrado");
        }
        clienteRepository.deleteById(id);
    }
}