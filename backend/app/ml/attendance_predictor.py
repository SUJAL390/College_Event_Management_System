
import os
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
import joblib
from datetime import datetime

class AttendancePredictor:
    def __init__(self):
        self.model = None
        
        self.model_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models')
        self.model_path = os.path.join(self.model_dir, 'attendance_model.pkl')
        os.makedirs(self.model_dir, exist_ok=True)     
      
        self.categorical_features = ['day_of_week', 'event_category', 'time_slot']
        self.numerical_features = [
            'days_to_event', 'user_past_attendance_rate', 
            'event_popularity', 'similar_events_attended'
        ]
    
    def _ensure_model_loaded(self):
       
        if self.model is None:
            try:
               
                self.model = joblib.load(self.model_path)
            except (FileNotFoundError, EOFError):

                self._create_basic_model()
    
    def _create_basic_model(self):
        
        
        categorical_transformer = Pipeline(steps=[
            ('onehot', OneHotEncoder(handle_unknown='ignore'))
        ])
        
        numerical_transformer = Pipeline(steps=[
            ('scaler', StandardScaler())
        ])
        
        preprocessor = ColumnTransformer(
            transformers=[
                ('cat', categorical_transformer, self.categorical_features),
                ('num', numerical_transformer, self.numerical_features)
            ])
        
        
        self.model = Pipeline(steps=[
            ('preprocessor', preprocessor),
            ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
        ])
    
    def train(self, training_data):
       
        if not isinstance(training_data, pd.DataFrame):
            raise ValueError("Training data must be a pandas DataFrame")
        

        required_cols = self.categorical_features + self.numerical_features + ['attended']
        missing_cols = [col for col in required_cols if col not in training_data.columns]
        if missing_cols:
            raise ValueError(f"Training data missing required columns: {missing_cols}")
        
        
        self._ensure_model_loaded()
      
        X = training_data[self.categorical_features + self.numerical_features]
        y = training_data['attended']
        
        self.model.fit(X, y)
        
      
        joblib.dump(self.model, self.model_path)
    
    def predict_attendance_probability(self, user_data):
       
        self._ensure_model_loaded()
        
      
        required_cols = self.categorical_features + self.numerical_features
        missing_cols = [col for col in required_cols if col not in user_data.columns]
        if missing_cols:
            raise ValueError(f"Input data missing required columns: {missing_cols}")
      
        X = user_data[self.categorical_features + self.numerical_features]
        
       
        return self.model.predict_proba(X)[:, 1]