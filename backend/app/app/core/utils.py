from sqlalchemy.inspection import inspect
from collections import defaultdict
import json
import pandas as pd


def query_to_list(rset):
    """List of result
    Return: columns name, list of result
    """
    result = []
    for obj in rset:
        instance = inspect(obj)
        items = instance.attrs.items()
        result.append([x.value for _,x in items])
    return instance.attrs.keys(), result

def query_to_dict(rset):
    result = defaultdict(list)
    for obj in rset:
        instance = inspect(obj)
        for key, x in instance.attrs.items():
            result[key].append(x.value)
    return result


def only_dict(d):
    '''
    Convert json string representation of dictionary to a python dict
    '''
    return json.loads(d)

def list_of_dicts(ld):
    '''
    Create a mapping of the tuples formed after 
    converting json strings of list to a python list   
    '''
    return dict([(list(d.values())[1], list(d.values())[0]) for d in json.loads(ld)])

def flatten_dict_to_pd_series(x):
    d = {}
    # Each element of the dict
    for k,v in x.items():
        # Check value type
        if isinstance(v,list):
            # If list: iter sub dict
            for k_s, v_s in v[0].items():
                d["{}_{}".format(k, k_s)] = v_s
        else: d[k] = v
    return pd.Series(d)