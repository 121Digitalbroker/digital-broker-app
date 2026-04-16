const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({}, { strict: false });
const Property = mongoose.models.Property || mongoose.model('Property', PropertySchema);

async function checkProperty() {
  try {
    await mongoose.connect('mongodb://localhost:27017/digital-broker');
    const p = await Property.findById('69d4a557348952a51e5d849b').lean();
    
    if (!p) {
      console.log('Property not found');
      return;
    }

    console.log('--- Property Info ---');
    console.log('Title:', p.projectName || p.title);
    console.log('--- Residential Configs ---');
    if (p.residentialConfigs) {
      p.residentialConfigs.forEach((c, i) => {
        console.log(`Config ${i + 1}:`, {
          typology: c.typology,
          servantRooms: c.servantRooms,
          raw_servant: c.servantRooms // sometimes it might be a string etc.
        });
      });
    } else {
      console.log('No residential configs found.');
    }
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

checkProperty();
