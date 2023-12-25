from pathlib import Path
from dataclasses import dataclass
from dataclasses import fields
import json


JSON_MAPPING = {Path: str}
REV_JSON_MAPPING = {v:k for k,v in JSON_MAPPING.items()}

@dataclass
class DataClassJSON:
    path: str
    
    def __post_init__(self):
        self.to_json()
  
    @classmethod
    def properties(cls):
        return [f.name for f in fields(cls) if f.name != "path"]

    @classmethod
    def from_json(cls, path, **kwargs):
        path = Path(path).absolute().resolve()
        if path.exists():
            with open(path, 'r') as f:
                data = json.load(f)
                data = {
                    k:v for k,v in data.items() if k in cls.properties()
                    }
                data["path"] = path
        else:
            data = {"path": path}
        
        # deserialize JSON properties
        data = {k: cls._deserialize(v) for k,v in data.items()}

        # overwrite properties
        for k, v in kwargs.items():
            data[k] = v

        return cls(**data)

    def __setitem__(self, key, value):
        setattr(self, key, self._deserialize(value))
        self.to_json()

    @staticmethod
    def _serialize(value):
        if value is not None:
            function = next((v for k,v in JSON_MAPPING.items() if isinstance(value, k)), None)
            if function is not None:
                value = function(value)
        return value
    
    @staticmethod
    def _deserialize(value):
        if value is not None:
            function = next((v for k,v in REV_JSON_MAPPING.items() if isinstance(value, k)), None)
            if function is not None:
                value = function(value)
        return value

    def to_json(self):
        
        # read properties and serialize
        data = {i: getattr(self, i) for i in self.properties()}
        data = {k: self._serialize(v) for k,v in data.items()}

        with open(self.path, 'w') as f:
            json.dump(data, f, indent=1)
