from pydantic import BaseModel


# ------------------------------------------------------------------------
# Modelos
# ------------------------------------------------------------------------


class VarDecisionModel(BaseModel):
    variables: list[float]


class RestriccionesModel(BaseModel):
    restricciones: list[list[float]]


class SimbolosModel(BaseModel):
    simbols: list[str]


class ObjetivoFuncionModel(BaseModel):
    objetivo: str
