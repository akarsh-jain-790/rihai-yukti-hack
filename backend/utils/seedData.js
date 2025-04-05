const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Case = require("../models/Case");
const Hearing = require("../models/Hearing");

// Helper function to create a random date within a range
const randomDate = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

// Helper function to get a random element from an array
const getRandomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Case.deleteMany({});
    await Hearing.deleteMany({});

    // Create users
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Create judges
    const judges = await User.insertMany([
      {
        firstName: "Rajesh",
        lastName: "Kumar",
        email: "judge1@example.com",
        password: hashedPassword,
        role: "judge",
        courtId: "DC-001",
        phone: "+91 9876543210",
      },
      {
        firstName: "Priya",
        lastName: "Sharma",
        email: "judge2@example.com",
        password: hashedPassword,
        role: "judge",
        courtId: "HC-002",
        phone: "+91 9876543211",
      },
    ]);

    // Create lawyers
    const lawyers = await User.insertMany([
      {
        firstName: "Amit",
        lastName: "Singh",
        email: "lawyer1@example.com",
        password: hashedPassword,
        role: "lawyer",
        barCouncilNumber: "MAH/12345/2020",
        phone: "+91 9876543212",
      },
      {
        firstName: "Neha",
        lastName: "Patel",
        email: "lawyer2@example.com",
        password: hashedPassword,
        role: "lawyer",
        barCouncilNumber: "DEL/67890/2019",
        phone: "+91 9876543213",
      },
    ]);

    // Create users (applicants)
    const applicants = await User.insertMany([
      {
        firstName: "Rahul",
        lastName: "Kumar",
        email: "user1@example.com",
        password: hashedPassword,
        role: "user",
        phone: "+91 9876543214",
        address: "123, ABC Colony, New Delhi - 110001",
      },
      {
        firstName: "Sunil",
        lastName: "Verma",
        email: "user2@example.com",
        password: hashedPassword,
        role: "user",
        phone: "+91 9876543215",
        address: "456, XYZ Society, Mumbai - 400001",
      },
      {
        firstName: "Priya",
        lastName: "Sharma",
        email: "user3@example.com",
        password: hashedPassword,
        role: "user",
        phone: "+91 9876543216",
        address: "789, PQR Apartments, Bangalore - 560001",
      },
      {
        firstName: "Vikram",
        lastName: "Patel",
        email: "user4@example.com",
        password: hashedPassword,
        role: "user",
        phone: "+91 9876543217",
        address: "101, LMN Heights, Chennai - 600001",
      },
    ]);

    // Sample data for cases
    const courts = [
      "Sessions Court, Delhi",
      "High Court, Mumbai",
      "District Court, Bangalore",
      "District Court, Chennai",
    ];
    const offenseTypes = ["bailable", "non-bailable"];
    const sections = [
      ["302", "307"], // Murder, Attempt to murder
      ["376"], // Sexual assault
      ["420"], // Cheating
      ["323"], // Voluntarily causing hurt
    ];
    const allegations = [
      "Accused of murder",
      "Accused of attempt to murder",
      "Accused of sexual assault",
      "Accused of cheating",
      "Accused of voluntarily causing hurt",
    ];
    const custodyStatuses = [
      "Police Custody",
      "Judicial Custody",
      "Not Arrested",
    ];
    const statuses = ["Pending", "Scheduled", "Approved", "Rejected"];
    const dcmCategories = ["Standard", "Complex", "Expedited"];

    // Create cases
    const cases = [];
    for (let i = 0; i < 10; i++) {
      const applicant = getRandomElement(applicants);
      const defendant = getRandomElement(applicants);
      const lawyer = getRandomElement(lawyers);
      const judge = getRandomElement(judges);
      const court = getRandomElement(courts);
      const offenseType = getRandomElement(offenseTypes);
      const sectionGroup = getRandomElement(sections);
      const allegation = getRandomElement(allegations);
      const custodyStatus = getRandomElement(custodyStatuses);
      const status = getRandomElement(statuses);
      const dcmCategory = getRandomElement(dcmCategories);

      const filingDate = randomDate(new Date(2022, 0, 1), new Date());
      const arrestDate = randomDate(new Date(2021, 0, 1), filingDate);

      const caseNumber = `C-${i + 1}/${filingDate.getFullYear()}`;

      const newCase = new Case({
        caseNumber,
        applicant: applicant._id,
        defendant: defendant._id,
        lawyer: lawyer._id,
        court,
        judge: judge._id,
        filingDate,
        status,
        offenseType,
        sections: sectionGroup,
        allegations: allegation,
        arrestDate,
        custodyStatus,
        custodyPeriod: Math.floor(Math.random() * 180) + 10, // 10-190 days
        bailGrounds: "No prior criminal record",
        previousBailApplications: Math.floor(Math.random() * 3),
        proposedBailConditions: [
          "Regular reporting to police station",
          "Surrender of passport",
        ],
        dcmCategory,
        updates: [
          {
            date: filingDate,
            description: "Case filed",
            updatedBy: lawyer._id,
          },
        ],
      });

      const savedCase = await newCase.save();
      cases.push(savedCase);
    }

    // Create hearings for each case
    for (const caseItem of cases) {
      const hearingCount = Math.floor(Math.random() * 3) + 1; // 1-3 hearings

      for (let j = 0; j < hearingCount; j++) {
        const hearingDate = randomDate(
          caseItem.filingDate,
          new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)
        ); // Up to 30 days in future
        const hearingStatus =
          hearingDate < new Date()
            ? getRandomElement(["Completed", "Adjourned"])
            : "Scheduled";

        const hearing = new Hearing({
          caseId: caseItem._id,
          date: hearingDate,
          time: `${Math.floor(Math.random() * 8) + 10}:${
            Math.random() > 0.5 ? "00" : "30"
          } ${Math.random() > 0.5 ? "AM" : "PM"}`,
          court: caseItem.court,
          judge: caseItem.judge,
          status: hearingStatus,
          purpose: "Hearing for case progress",
          notes:
            hearingStatus === "Completed"
              ? "Hearing completed as scheduled"
              : "",
          outcome:
            hearingStatus === "Completed"
              ? caseItem.status === "Approved"
                ? "Case approved"
                : caseItem.status === "Rejected"
                ? "Case rejected"
                : ""
              : "",
          attendees: [
            {
              user: caseItem.applicant,
              role: "Applicant",
              attended: hearingStatus === "Completed",
            },
            {
              user: caseItem.lawyer,
              role: "Lawyer",
              attended: hearingStatus === "Completed",
            },
            {
              user: caseItem.judge,
              role: "Judge",
              attended: hearingStatus === "Completed",
            },
          ],
        });

        const savedHearing = await hearing.save();

        // Update case with hearing reference
        caseItem.hearings.push(savedHearing._id);
        await caseItem.save();
      }
    }

    console.log(
      "Seed data for users, cases, and hearings created successfully"
    );
  } catch (error) {
    console.error("Error seeding data:", error);
    throw error;
  }
};

module.exports = seedData;
