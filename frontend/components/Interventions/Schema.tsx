import * as yup from "yup";
import { useTranslation } from "react-i18next";

export type TInterventionType = 
  "pruning"
  | "felling"
  | "streanremoval" 
  | "indepthdiagnostic"
  | "treatment"
  | "surveillance";

export const interventionTypes: TInterventionType[] = [
  'pruning', 'felling', 'streanremoval', 'indepthdiagnostic', 'treatment', 'surveillance'
];

export type TRequiredMaterial = 'soil'
  | 'pole'
  | 'climb'
  | 'ladder'
  | 'raiser'
  | 'retentionkit'
  | 'foot'
  | 'pull'
  | 'trimmer'
  | 'crane'
  | 'coredrill'
  | 'crunchy'
  | 'mecanicshovel'
  | 'canon'
  | 'watering'
  | 'amendment'
  | 'tutorrefection'
  | 'colletprotection'
  | 'scald'
  | 'lattersurveillance';

export const requiredMaterials: TRequiredMaterial[] = [
  'pole', 'climb', 'ladder', 'raiser', 'retentionkit', 'foot', 'pull', 'trimmer',
  'crane', 'coredrill', 'crunchy', 'mecanicshovel', 'canon', 'watering',
  'amendment', 'tutorrefection', 'colletprotection', 'scald', 'lattersurveillance'
]

export type TRequiredDocuments = 'dt' | 'trafficpolice';
export const requiredDocuments: TRequiredDocuments[] = ['dt', 'trafficpolice'];

const requiredMaterial: {[t in TInterventionType]: TRequiredMaterial[]} = {
  pruning: [
    'pole',
    'climb',
    'ladder',
    'raiser',
    'retentionkit'
  ],
  felling: [
    'foot',
    'pull',
    'retentionkit',
    'climb',
    'ladder',
    'raiser',
    'crane'
  ],
  streanremoval: [
    'trimmer',
    'coredrill',
    'crunchy',
    'mecanicshovel'
  ],
  indepthdiagnostic: [
    'soil',
    'climb',
    'ladder',
    'raiser'
  ],
  treatment: [
    'soil',
    'climb',
    'canon'
  ],
  surveillance: [
    'watering',
    'amendment',
    'tutorrefection',
    'colletprotection',
    'scald',
    'lattersurveillance'
  ]
};

const interventionMethod: {[it in TInterventionType]: string[]} = {
  indepthdiagnostic: [
    'restistograph',
    'tomograph',
    'computing',
    'tractiontest',
    'penetrometer'
  ],
  surveillance: [
    'watering',
    'amendment',
    'tutorcheck',
    'latterverification'
  ],
  treatment: [
    'auxilaryrelease',
    'biologictreatment'
  ],
  streanremoval: [
    'drilling',
    'trimming',
    'grubbing'
  ],
  felling: [
    'live',
    'rentention',
    'unmounting'
  ],
  pruning: [
    'pruning',
    'carpenterremoval',
    'lightning',
    'maintenance',
    'crownraising'
  ]
}

function sitem(value, t, tpath) {
  return {
    value,
    label: t(`${tpath}.${value}`)
  }
}

function requiredDocumentsItems (it: TInterventionType, t) {
  return ['dt', 'trafficpolice']
    .map(item => sitem(item, t, 'components:Intervention.documents'))
}

function requiredMaterialItems(it: TInterventionType, t) {
  return requiredMaterial[it]
    .map(item => sitem(item, t, 'components:Intervention.material'))
}

export const interventionSteps = [
  'selection',
  'validation'
]

export function useInterventionSelectionSchema() {
  const { t } = useTranslation(['common', 'components']);

  return {
    intervention: {
      type: 'select',
      components: {
        items: interventionTypes.map(it => sitem(it, t, 'components:Intervention.types'))   
      }
    }
  }
}

export function useInterventionTreeSelectionSchema() {
  const { t } = useTranslation(['common', 'components']);

  return {
    x: {
      step: 'selection',
      type: 'textfield',
      component: {
        type: 'number',
        label: 'longitude'
      },
      schema: yup.string().required(t('common:errors.required'))
    },
    y: {
      step: 'selection',
      type: 'textfield',
      component: {
        type: 'number',
        label: 'latitude'
      },
      schema: yup.string().required(t('common:errors.required'))
    }
  }
}

export function useInterventionSchema (it: TInterventionType) {
  const { t } = useTranslation(['common', 'components'])
  const interventionSchemas: {[it in TInterventionType]: any} = {
    pruning: {
      method: {
        type: 'select',
        component: {
          label: t('components:Intervention.streanremoval.method'),
          items: interventionMethod.streanremoval.map(m => sitem(m, t, 'components:Intervention.streanremoval'))
        },
        schema: yup.string().required(t('common:errors.required'))
      },
      comment: {
        type: 'textfield',
        component: {
          label: t('components:Intervention.streanremoval.comment')
        },
        schema: yup.string()
      }
    },
    felling: {
      method: {
        type: 'select',
        component: {
          label: t('components:Intervention.felling.method'),
          items: interventionMethod.felling.map(m => sitem(m, t, 'components:Intervention.felling'))
        },
        schema: yup.string().required(t('common:errors.required'))
      },
      comment: {
        type: 'textfield',
        component: {
          label: t('components:Intervention.felling.comment')
        },
        schema: yup.string()
      }
    },
    streanremoval: {
      streandiameter: {
        type: 'textfield',
        component: {
          type: 'number',
          label: t('components:Intervention.streanremoval.diameter')
        },
        schema: yup.string().required(t('common:errors.required'))
      },
      method: {
        type: 'select',
        component: {
          label: t('components:Intervention.streanremoval.method'),
          items: interventionMethod.streanremoval.map(m => sitem(m, t, 'components:Intervention.streanremoval'))
        },
        schema: yup.string().required(t('common:errors.required'))
      }
    },
    surveillance: {
      method: {
        type: 'select',
        component: {
          multiple: true,
          label: t('components:Intervention.streanremoval.method'),
          items: interventionMethod.streanremoval.map(m => sitem(m, t, 'components:Intervention.streanremoval'))
        },
        schema: yup.string().required(t('common:errors.required'))
      },
      comment: {
        type: 'textfield',
        component: {
          label: t('components:Intervention.streanremoval.comment')
        },
        schema: yup.string()
      }
    },
    treatment: {
      method: {
        type: 'select',
        component: {
          label: t('components:Intervention.treatment.method'),
          items: interventionMethod.treatment.map(m => sitem(m, t, 'components:Intervention.treatment'))
        },
        schema: yup.string().required(t('common:errors.required'))
      },
      disease: {
        type: 'textfield',
        component: {
          label: t('components:Intervention.treatment.disease')
        },
        schema: yup.string().required(t('common:errors.required'))
      },
      comment: {
        type: 'textfield',
        component: {
          label: t('components:Intervention.treatment.comment')
        },
        schema: yup.string()
      }
    },
    indepthdiagnostic: {
      method: {
        type: 'select',
        component: {
          label: t('components:Intervention.indepthdiagnostic.method'),
          multiple: true,
          items: interventionMethod.indepthdiagnostic.map(m => sitem(m, t, 'components:Intervention.indepthdiagnostic'))
        },
        schema: yup.string().required(t('common:errors.required'))
      },
      comment: {
        type: 'textfield',
        component: {
          label: t('components:Intervention.indepthdiagnostic.comment')
        },
        schema: yup.string()
      }
    }
  }
}

export default function useInterventionValidationSchema(it: TInterventionType) {
  const { t } = useTranslation(["common", "components"]);

  return {
    plan_date_interval: {
      step: "validation",
      type: "daterange",
      component: {
        label: t("components:Intervention.plan_date_interval"),
      },
      schema: yup.string().required(t("common:errors.required")),
    },
    estimated_cost: {
      step: "validation",
      type: "textfield",
      component: {
        type: "number",
        label: t("components:Intervention.estimated_cost"),
      },
      schema: yup.string().required(t("common:errors.required")),
    },
    required_documents: {
      step: "validation",
      type: "select",
      component: {
        multiple: true,
        label: t("components:Intervention.required_documents"),
        items: requiredDocumentsItems(it, t)
      },
      schema: yup.string().required(t("common:errors.required")),
    },
    required_material: {
      step: "validation",
      type: "select",
      component: {
        multiple: true,
        items: requiredMaterialItems(it, t),
        label: t("components:Intervention.required_material")
      },
      schema: yup.string().required(t("common:errors.required"))
    },
    intervenant: {
      step: "validation",
      type: "textfield",
      component: {
        label: t("components:Intervention.intervenant")
      },
      schema: yup.string().required(t("common:errors.required"))
    }
  }
}