const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({}, { strict: false });
const Property = mongoose.models.Property || mongoose.model('Property', PropertySchema);

async function updatePropertyData() {
  try {
    await mongoose.connect('mongodb://localhost:27017/digital-broker');
    const p = await Property.findById('69d4a557348952a51e5d849b');
    
    if (!p) {
      console.log('Property not found');
      return;
    }

    if (p.residentialConfigs) {
      p.residentialConfigs = p.residentialConfigs.map(c => {
        // If it's a 4BHK, let's assume it has 1 Servant room for this demo
        if (c.typology === '4BHK') {
          return { ...c, servantRooms: 1 };
        }
        return c;
      });
      
      // Mark as modified if using Mongoose models with mixed types
      p.markModified('residentialConfigs');
      await p.save();
      console.log('Successfully updated 4BHK to include a Servant Room (+S).');
    }
  } catch (err) {
    console.error('Update failed:', err);
  } finally {
    mongoose.disconnect();
  }
}

updatePropertyData();
