package com.hidro.manh.ctrl;

import com.hidro.manh.dto.ClienteDto;
import com.hidro.manh.srs.ClienteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @GetMapping
    public ResponseEntity<List<ClienteDto>> getAllClients() {
        List<ClienteDto> clients = clienteService.getAllClients();
        return ResponseEntity.ok(clients);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteDto> getClientById(@PathVariable Long id) {
        ClienteDto client = clienteService.getClientById(id);
        return ResponseEntity.ok(client);
    }

    @PostMapping
    public ResponseEntity<ClienteDto> createClient(@RequestBody ClienteDto clientDto) {
        ClienteDto createdClient = clienteService.createClient(clientDto);
        return ResponseEntity.ok(createdClient);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClienteDto> updateClient(@PathVariable Long id, @RequestBody ClienteDto clientDto) {
        ClienteDto updatedClient = clienteService.updateClient(id, clientDto);
        return ResponseEntity.ok(updatedClient);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable Long id) {
        clienteService.deleteClient(id);
        return ResponseEntity.noContent().build();
    }
}
