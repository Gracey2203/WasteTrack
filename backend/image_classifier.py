import tensorflow as tf
from tensorflow import keras

class WasteClassifier:
    def __init__(self, num_classes=5):
        self.num_classes = num_classes
        self.model = self._build_model()
    
    def _build_model(self):
        model = keras.Sequential([
            keras.layers.Conv2D(32, (3, 3), activation='relu', input_shape=(224, 224, 3)),
            keras.layers.MaxPooling2D((2, 2)),
            keras.layers.Conv2D(64, (3, 3), activation='relu'),
            keras.layers.MaxPooling2D((2, 2)),
            keras.layers.Conv2D(64, (3, 3), activation='relu'),
            keras.layers.Flatten(),
            keras.layers.Dense(64, activation='relu'),
            keras.layers.Dropout(0.5),
            keras.layers.Dense(self.num_classes, activation='softmax')
        ])
        return model
    
    def compile(self):
        self.model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
    
    def train(self, train_dir, epochs=10):
        batch_size = 32
        train_ds = keras.utils.image_dataset_from_directory(
            train_dir,
            image_size=(224, 224),
            batch_size=batch_size
        )
        train_ds = train_ds.map(lambda x, y: (tf.cast(x, tf.float32) / 255.0, y))
        self.model.fit(train_ds, epochs=epochs)