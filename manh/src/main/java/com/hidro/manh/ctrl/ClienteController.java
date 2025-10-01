package com.hidro.manh.ctrl;

import com.hidro.manh.ety.Cliente;
import com.hidro.manh.srs.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    // Listar clientes paginados
    @GetMapping
    public Page<Cliente> getAllClientes(Pageable pageable) {
        return clienteService.getAllClientes(pageable);
    }

    // Filtrar clientes por región
    @GetMapping("/region/{regionId}")
    public Page<Cliente> getClientesByRegion(@PathVariable Integer regionId, Pageable pageable) {
        return clienteService.getClientesByRegion(regionId, pageable);
    }

    // Filtrar clientes por comuna
    @GetMapping("/comuna/{comunaId}")
    public Page<Cliente> getClientesByComuna(@PathVariable Integer comunaId, Pageable pageable) {
        return clienteService.getClientesByComuna(comunaId, pageable);
    }

    // Obtener cliente específico
    @GetMapping("/{id}")
    public Optional<Cliente> getCliente(@PathVariable Long id) {
        return clienteService.getClienteById(id);
    }

    // Crear o actualizar cliente
    @PostMapping
    public Cliente saveCliente(@RequestBody Cliente cliente) {
        return clienteService.saveCliente(cliente);
    }

    // Eliminar cliente
    @DeleteMapping("/{id}")
    public void deleteCliente(@PathVariable Long id) {
        clienteService.deleteCliente(id);
    }
}
