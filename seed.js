require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');
const Category = require('./models/category');
const Event = require('./models/event');
const Registration = require('./models/registration');
const Message = require('./models/message');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB for seeding...');

    // Delete in reverse order of reference dependencies
    await Message.deleteMany();
    await Registration.deleteMany();
    await Event.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    // 1. Seed Users
    const users = await User.create([
      { name: 'Admin User', email: 'admin@eventpulse.com', password: 'hashedpassword123', role: 'admin' },
      { name: 'John Doe', email: 'john@example.com', password: 'hashedpassword123', role: 'attendee' }
    ]);

    // 2. Seed Categories
    const categories = await Category.create([
      { name: 'Tech', description: 'Tech events & hackathons' },
      { name: 'Music', description: 'Live concerts and festivals' }
    ]);

    // 3. Seed Event
    const event = await Event.create({
      title: 'Tech Summit 2026',
      description: 'Annual technology conference',
      category: categories[0]._id,
      date: new Date('2026-10-15'),
      city: 'Cairo',
      venue: 'Main Hall',
      capacity: 100,
      organizer: users[0]._id
    });

    // 4. Seed Registration
    await Registration.create({
      event: event._id,
      attendee: users[1]._id
    });

    // 5. Seed Message
    await Message.create({
      event: event._id,
      sender: users[1]._id,
      text: 'Looking forward to this event!'
    });

    console.log('Database seeded successfully!');
    process.exit();
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedData();