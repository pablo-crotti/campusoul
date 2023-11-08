import mongoose from 'mongoose';

const interestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
});

// Vous pouvez ajouter des méthodes ou des fonctionnalités supplémentaires au schéma ici, comme des méthodes personnalisées ou des index.

// Créer le modèle en utilisant le schéma
const Interest = mongoose.model('Interest', interestSchema);

export default Interest;
