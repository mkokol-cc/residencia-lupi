import { MovimientoSaldo } from "../../model/movimiento-saldo";

export const MOVIMIENTO_SALDO_DATA: MovimientoSaldo[] = [/*
    {
    i: 1,
    esEntrad: false,
    mont: 50000,
    entida: {i: 3,dniCui: "30-34567890-1",nombr: "MUNICIPALIDAD" },
    concept: {
      i:2,
      nombr:"Servicios",
      esDeIngres:false
        },
      /descripcio: 'Sueldo de Mayo',
    fechaHor: new Date('2024-05-01')
    },
    {
    i: 2,
    esEntrad: false,
    mont: 2500,
    entida: {i: 30,dniCui: "20-01234569-2",nombr: "CARNICERÍA COCO" },
    concept: {
      i:3,
      nombr:"Alimentos",
      esDeIngres:false
        },
    descripcio: 'Compra semanal',
    fechaHor: new Date('2024-05-15')
    }
];




[*/
  {
      id: 1,
      esEntrada: false,
      esResidencia: true, 
      monto: 50000,
      entidad: {
          id: 3,
          dniCuit: "30-34567890-1",
          nombre: "MUNICIPALIDAD"
      },
      concepto: {
          id: 2,
          nombre: "Servicios",
          esDeIngreso: false
      },
      fechaHora: new Date("2024-05-01")
  },
  {
      id: 2,
      esEntrada: false,
      esResidencia: true, 
      monto: 2500,
      entidad: {
          id: 30,
          dniCuit: "20-01234569-2",
          nombre: "CARNICERÍA COCO"
      },
      concepto: {
          id: 3,
          nombre: "Alimentos",
          esDeIngreso: false
      },
      descripcion: "Compra semanal",
      fechaHora: new Date("2024-05-15")
  },
  {
      esEntrada: true,
      esResidencia: true, 
      monto: 1450000,
      entidad: {
          id: 1,
          
          nombre: "RAQUEL",
          dniCuit: "46913810"
      },
      concepto: {
          id: 13,
          nombre: "Cuota Mensual",
          esDeIngreso: true
      },
      descripcion: "Liquidación cuota mensual 12/2025",
      fechaHora: new Date("2025-12-01"),
      id: 3
  },
  {
      esEntrada: true,
      esResidencia: true, 
      monto: 1600000,
      entidad: {
          id: 2,
          
          nombre: "NELIDA",
          
          
          
          dniCuit: "23756669"
      },
      concepto: {
          id: 13,
          nombre: "Cuota Mensual",
          esDeIngreso: true
      },
      descripcion: "Liquidación cuota mensual 12/2025",
      fechaHora: new Date("2025-12-01"),
      id: 4
  },
  {
      esEntrada: true,
      esResidencia: true, 
      monto: 36200,
      entidad: {
          id: 2,
          //
          nombre: "NELIDA",
          //
          //
          //
          dniCuit: "23756669"
      },
      concepto: {
          id: 12,
          nombre: "Pañales",
          esDeIngreso: true
      },
      descripcion: "Liquidación pañales 12/2025",
      fechaHora: new Date("2025-12-01"),
      id: 5
  },
  {
      esEntrada: true,
      esResidencia: true, 
      monto: 1400000,
      entidad: {
          id: 3,
          
          nombre: "FELIPA",
          
          
          
          dniCuit: "22575562"
      },
      concepto: {
          id: 13,
          nombre: "Cuota Mensual",
          esDeIngreso: true
      },
      descripcion: "Liquidación cuota mensual 12/2025",
      fechaHora: new Date("2025-12-01"),
      id: 6
  },
  {
      esEntrada: true,
      esResidencia: true, 
      monto: 1450000,
      entidad: {
          id: 4,
          
          nombre: "NIDIA",
          
          
          
          dniCuit: "90801586"
      },
      concepto: {
          id: 13,
          nombre: "Cuota Mensual",
          esDeIngreso: true,
      },
      descripcion: "Liquidación cuota mensual 12/2025",
      fechaHora: new Date("2025-12-01"),
      id: 7
  },
  {
      esEntrada: true,
      esResidencia: true, 
      monto: 58500,
      entidad: {
          id: 4,
          
          nombre: "NIDIA",
          
          
          
          dniCuit: "90801586"
      },
      concepto: {
          id: 12,
          nombre: "Pañales",
          esDeIngreso: true
      },
      descripcion: "Liquidación pañales 12/2025",
      fechaHora: new Date("2025-12-01"),
      id: 8
  },
  {
      esEntrada: true,
      esResidencia: true, 
      monto: 1350000,
      entidad: {
          id: 5,
          
          nombre: "IMELDA",
          
          
          
          dniCuit: "70291817"
      },
      concepto: {
          id: 13,
          nombre: "Cuota Mensual",
          esDeIngreso: true
      },
      descripcion: "Liquidación cuota mensual 12/2025",
      fechaHora: new Date("2025-12-01"),
      id: 9
  }
]