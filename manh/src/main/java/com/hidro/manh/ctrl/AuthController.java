package com.hidro.manh.ctrl;

import com.hidro.manh.dto.JwtRequest;
import com.hidro.manh.dto.JwtResponse;
import com.hidro.manh.ety.Usuario;
import com.hidro.manh.rep.UsuarioRepository;
import com.hidro.manh.security.JwtTokenUtil;
import com.hidro.manh.srs.JwtUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private JwtUserDetailsService userDetailsService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody JwtRequest authenticationRequest) throws Exception {
        authenticate(authenticationRequest.getUsername(), authenticationRequest.getPassword());

        final UserDetails userDetails = userDetailsService.loadUserByUsername(authenticationRequest.getUsername());
        final String token = jwtTokenUtil.generateToken(userDetails);

        // Obtener información adicional del usuario
        Usuario usuario = usuarioRepository.findByUsuario(authenticationRequest.getUsername())
                .orElseThrow(() -> new Exception("Usuario no encontrado"));

        return ResponseEntity.ok(new JwtResponse(token, usuario.getUsuario(), 
                usuario.getRol().name(), usuario.getNombre()));
    }

    private void authenticate(String username, String password) throws Exception {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (DisabledException e) {
            throw new Exception("USUARIO_DESHABILITADO", e);
        } catch (BadCredentialsException e) {
            throw new Exception("CREDENCIALES_INVALIDAS", e);
        }
    }
}