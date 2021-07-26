from datetime import datetime, date
from uuid import UUID
from typing import Optional, Any
from enum import Enum
from pydantic import BaseModel, Field, ValidationError, validator

class HealthAssessmentOrgan(str, Enum):
    UNDEFINED = "undefined"
    CROWN = "crown"
    BRANCHES = "branches"
    TRUNK = "trunk"
    TRUNKFLARE = "trunkflare"
    ROOTS = "roots"

class HealthAssessmentBase(BaseModel):
    date: date
    organ: HealthAssessmentOrgan = Field(...)
    score: int = Field(
        1,
        title="Score ONF",
        description="Echelle de notation inspiré de l'ONF : 1 = surveillance dans 5 ans; 2 = surveillance dans 2 ans; 3 = demande d’intervention; 4 = intervention d’urgence ",
        ge=1,
        le=4,
    )
    intervention_needed: bool
    problem: str = Field(...)
    recommendation: str = Field(...)
    comment: str
    created_at: datetime = Field(...)
    updated_at: datetime = Field(...)

    @validator('problem')
    def check_problem_allowed_values(cls, v, values, **kwargs):
        if 'organ' in values:
            if values['organ'] == "crown":
                problem_allowed_values = [
                    "Parasite/Maladie",
                    "Bois mort",
                    "Dessèchement",
                    "Altération",
                    "Déchirure/Fracture",
                    "Cavité",
                    "Gabarit",
                    "Mauvaise Insertion",
                    "Ecorce Incluse",
                    "Torsion",
                ]
                if v not in problem_allowed_values:
                    raise ValueError(f"values must be in {problem_allowed_values}") 
            elif values['organ'] == "branches":
                problem_allowed_values = [
                    "Parasite/Maladie",
                    "Bois mort",
                    "Dessèchement des feuilles",
                    "Descente de cime",
                    "Décoloration du feuillage",
                    "Gabarit Gênant",
                ]
                if v not in problem_allowed_values:
                    raise ValueError(f"values must be in {problem_allowed_values}")
            elif values['organ'] == "trunk":
                problem_allowed_values = [
                    "Parasite/Maladie",
                    "Bois mort",
                    "Altération",
                    "Déchirure/Fracture",
                    "Torsion",
                    "Cavité",
                ]
                if v not in problem_allowed_values:
                    raise ValueError(f"values must be in {problem_allowed_values}")
            elif values['organ'] == "trunkflare":
                problem_allowed_values = [
                    "Parasite/Maladie",
                    "Bois mort",
                    "Altération",
                    "Déchirure/Fracture",
                    "Etranglement racinaire",
                    "Cavité",
                ]
                if v not in problem_allowed_values:
                    raise ValueError(f"values must be in {problem_allowed_values}")
            elif values['organ'] == "roots":
                problem_allowed_values = [
                    "Parasite/Maladie",
                    "Dessèchement",
                    "Altération",
                    "Déchirure",
                    "Remontée racinaire",
                    "Déracinement",
                ]
                if v not in problem_allowed_values:
                    raise ValueError(f"values must be in {problem_allowed_values}")
            else:
                print("Didn't match a case")
                return v
            return v
        return v
        
    @validator('recommendation')
    def check_recommendation_allowed_values(cls, v):
        recommendation_allowed_values = [
            "Diagnostic approfondi",
            "Surveillance",
        ]
        if v not in recommendation_allowed_values:
            raise ValueError(f"values must be in {recommendation_allowed_values}")
        return v

class HealthAssessmentCreate(HealthAssessmentBase):
    tree_id: Optional[int]
    organization_id: Optional[int]
    pass

class HealthAssessmentUpdate(HealthAssessmentBase):
    pass

class HealthAssessment(HealthAssessmentBase):
    id: int
    

    class Config:
        orm_mode = True