import { prisma } from './config/db.js';
import type { Student } from '@shared/types.js';

const firstNames = ['Amit', 'Rahul', 'Aman', 'Priya', 'Sneha', 'Vikram', 'Rohan', 'Anjali', 'Karan', 'Neha'];
const lastNames = ['Sharma', 'Verma', 'Dixit', 'Joshi', 'Patel', 'Singh', 'Gupta', 'Kumar', 'Das', 'Mehta'];
const grades = ['MCA', 'BCA', 'B.Tech', 'M.Tech', 'MBA'];
const subjects = ['maths', 'science', 'english', 'hindi', 'computer'];

async function main() {
  console.log('🔄 Seeding 50 students into the database...');

  await prisma.mark.deleteMany({});
  await prisma.student.deleteMany({});

  for (let i = 1; i <= 50; i++) {
    const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = `${randomFirstName} ${randomLastName}`;
    
    const randomGrade = grades[Math.floor(Math.random() * grades.length)] as Student['grade'];
    const randomAge = Math.floor(Math.random() * (28 - 18 + 1)) + 18;
    const baseRoll = 202600 + i;

    await prisma.student.create({
      data: {
        name: fullName,
        grade: randomGrade,
        rollNumber: baseRoll,
        age: randomAge,
        marks: {
          create: subjects.map(subject => ({
            subject: `${subject}`,
            score: Math.floor(Math.random() * (100 - 40 + 1)) + 40
          }))
        }
      }
    });
  }

  console.log('✅ Successfully seeded 50 dynamic students with mock marks records!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed error context:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
