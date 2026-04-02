export type Perfil = "Corretor" | "Investimento" | "Moradia";

export interface CadastroData {
  nome: string;
  telefone: string;
  email: string;
  perfil: Perfil;
}

export interface FormErrors {
  nome?: string;
  telefone?: string;
  email?: string;
  perfil?: string;
}

export interface RDStationPayload {
  event_type: "CONVERSION";
  event_family: "CDP";
  payload: {
    conversion_identifier: string;
    name: string;
    email: string;
    mobile_phone: string;
    cf_perfil: Perfil;
    tags: string[];
    traffic_source: string;
  };
}
