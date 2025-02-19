import { writeFileSync } from 'fs';

const generateConsumers = (count: number) => {
  const consumers = [];
  const civilities = ['M.', 'Mme'];
  const firstnames = ['Jean', 'Marie', 'Pierre', 'Sophie', 'Paul', 'Julie', /* ... */];
  const lastnames = ['Dupont', 'Martin', 'Bernard', 'Petit', 'Robert', /* ... */];

  for (let i = 1; i <= count; i++) {
    const firstname = firstnames[Math.floor(Math.random() * firstnames.length)];
    const lastname = lastnames[Math.floor(Math.random() * lastnames.length)];

    consumers.push({
      id: i,
      civility: civilities[Math.floor(Math.random() * civilities.length)],
      firstname,
      lastname,
      email: `${firstname.toLowerCase()}.${lastname.toLowerCase()}@email.com`,
      phone: `0${Math.floor(Math.random() * 90000000 + 100000000)}`,
      createdAt: new Date(2024, Math.floor(Math.random() * 3), Math.floor(Math.random() * 28)).toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
  return consumers;
};

const db = {
  consumers: generateConsumers(50)
};

writeFileSync('db.json', JSON.stringify(db, null, 2));
