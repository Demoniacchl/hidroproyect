package com.hidro.manh.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.Date;
import com.hidro.manh.enums.EstadoMantenimiento;
import com.hidro.manh.enums.TipoOrden;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrdenMantenimientoDto {
    private Long idOrden;
    private Long idMotor;
    private Long idTecnico;

    private Date horaIngreso;
    private Date horaSalida;

    private BigDecimal r;
    private BigDecimal s;
    private BigDecimal t;
    private BigDecimal voltaje;

    private String observaciones;
    private String firmaCliente;
    private TipoOrden tipoOrden;
    private String campoAdicional;

    private EstadoMantenimiento cambioRodamientos;
    private EstadoMantenimiento cambioSello;
    private EstadoMantenimiento cambioVoluta;
    private EstadoMantenimiento rebobinoCampos;
    private EstadoMantenimiento proteccionesSaltadas;
    private EstadoMantenimiento cambioProtecciones;
    private EstadoMantenimiento contactoresQuemados;
    private EstadoMantenimiento cambioContactores;
    private EstadoMantenimiento cambioLucesPiloto;
    private EstadoMantenimiento limpioTablero;
    private EstadoMantenimiento cambioPresostato;
    private EstadoMantenimiento cambioManometro;
    private EstadoMantenimiento cargoConAireEp;
    private EstadoMantenimiento revisoPresionEp;
    private EstadoMantenimiento cambioValvRetencion;
    private EstadoMantenimiento suprimoFiltracion;
    private EstadoMantenimiento revisoValvCompuerta;
    private EstadoMantenimiento revisoValvFlotador;
    private EstadoMantenimiento revisoEstanqueAgua;
    private EstadoMantenimiento revisoFittingsOtros;

        private Long idCliente;
    private Long idUbicacion;
}
