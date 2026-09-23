const mongoose = require('mongoose');
const dotenv = require('dotenv');

const User = require('./models/User');
const Club = require('./models/Club');
const Event = require('./models/Event');
const Registration = require('./models/Registration');

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const seedData = async () => {
  try {
    await User.deleteMany();
    await Club.deleteMany();
    await Event.deleteMany();
    await Registration.deleteMany();

        
    const admin = await User.create({
      name: 'Campus Admin',
      email: 'admin@pillai.edu',
      password: 'Admin@123',
      role: 'admin',
    });

    const coord = await User.create({
      name: 'Aaryan Wavare',
      email: 'aaryan@pillai.edu',
      password: 'Coord@123',
      role: 'coordinator',
      club: 'Tech Society'
    });

    const student = await User.create({
      name: 'Aditi Kadam',
      email: 'aditi.kadam@pillai.edu',
      password: 'Student@123',
      role: 'student',
      department: 'Computer Science',
      year: 'Third Year',
      interests: ['AI', 'Design']
    });

    const club1 = await Club.create({ name: 'Tech Society', coordinatorIds: [coord._id], color: 'indigo' });
    const club2 = await Club.create({ name: 'Cultural Council', coordinatorIds: [coord._id], color: 'rose' });
    const club3 = await Club.create({ name: 'Business Club', coordinatorIds: [coord._id], color: 'emerald' });
    const club4 = await Club.create({ name: 'Literature Club', coordinatorIds: [coord._id], color: 'amber' });

    const event1 = await Event.create({
      title: 'Campus AI Summit',
      clubId: club1._id,
      category: 'Technology',
      venue: 'Conclave',
      startTime: new Date('2026-09-08T10:00:00+05:30'),
      endTime: new Date('2026-09-08T16:00:00+05:30'),
      seatLimit: 180,
      seatsFilled: 1,
      status: 'approved',
      image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80',
      description: 'A day of student-led AI demos, faculty talks, and rapid prototyping sessions for applied campus problems.',
      highlights: ['Prototype showcase', 'Faculty keynote', 'Networking lunch'],
      creatorId: coord._id
    });

    const event2 = await Event.create({
      title: 'Music Night',
      clubId: club2._id,
      category: 'Culture',
      venue: 'Conclave',
      startTime: new Date('2026-09-05T18:30:00+05:30'),
      endTime: new Date('2026-09-05T21:00:00+05:30'),
      seatLimit: 250,
      seatsFilled: 0,
      status: 'approved',
      image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=80',
      description: 'An open-air evening featuring student bands, poetry sets, and low-key food stalls under the courtyard lights.',
      highlights: ['Live bands', 'Open mic', 'Food stalls'],
      creatorId: coord._id
    });

    await Registration.create({
      userId: student._id,
      eventId: event1._id,
      status: 'registered'
    });

    console.log('Data seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
