const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User");
const Case = require("../models/Case");
const Hearing = require("../models/Hearing");
const RiskAssessment = require("../models/RiskAssessment");

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
    await RiskAssessment.deleteMany({});

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
    const users = await User.insertMany([
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
      "Sessions Court, Bangalore",
      "District Court, Chennai",
    ];
    const offenseTypes = ["bailable", "non-bailable", "economic"];
    const sections = [
      ["BNS 103", "BNS 109"], // Murder, Attempt to murder
      ["BNS 65"], // Sexual assault
      ["BNS 318", "BNS 320"], // Cheating
      ["BNS 115"], // Grievous hurt
      ["BNS 174", "BNS 175"], // Non-attendance
    ];
    const allegations = [
      "Accused of murder with premeditation",
      "Accused of attempt to murder",
      "Accused of sexual assault",
      "Accused of cheating and dishonestly inducing delivery of property",
      "Accused of voluntarily causing grievous hurt",
      "Accused of non-attendance in obedience to an order from public servant",
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
    for (let i = 0; i < 20; i++) {
      const applicant = getRandomElement(users);
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

      const caseNumber = `BA-${i + 1}/${filingDate.getFullYear()}`;

      const newCase = new Case({
        caseNumber,
        applicant: applicant._id,
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
        bailGrounds:
          "The accused has no prior criminal record and is a first-time offender. The accused has strong roots in the community and is not a flight risk.",
        previousBailApplications: Math.floor(Math.random() * 3),
        proposedBailConditions: [
          "Regular reporting to police station",
          "Surrender of passport",
          "Not to leave the city without permission",
        ],
        dcmCategory,
        updates: [
          {
            date: filingDate,
            description: "Bail application filed",
            updatedBy: lawyer._id,
          },
        ],
      });

      const savedCase = await newCase.save();
      cases.push(savedCase);

      // Create risk assessment for each case
      if (Math.random() > 0.3) {
        // 70% of cases have risk assessment
        const criminalHistoryLevel =
          Math.random() < 0.5 ? "low" : Math.random() < 0.7 ? "medium" : "high";
        const flightRiskLevel =
          Math.random() < 0.6 ? "low" : Math.random() < 0.8 ? "medium" : "high";
        const severityLevel =
          offenseType === "bailable"
            ? "low"
            : offenseType === "non-bailable"
            ? "high"
            : "medium";
        const socialLevel =
          Math.random() < 0.5 ? "low" : Math.random() < 0.7 ? "medium" : "high";

        // Calculate scores
        const getScoreValue = (level) => {
          switch (level) {
            case "low":
              return 1;
            case "medium":
              return 2;
            case "high":
              return 3;
            default:
              return 1;
          }
        };

        const weights = {
          criminalHistory: 0.3,
          flightRisk: 0.25,
          severityOfCharges: 0.3,
          socialEconomic: 0.15,
        };

        const factors = [
          {
            name: "Criminal History",
            score: getScoreValue(criminalHistoryLevel),
            weight: weights.criminalHistory,
            weightedScore:
              getScoreValue(criminalHistoryLevel) * weights.criminalHistory,
            direction: criminalHistoryLevel === "low" ? "positive" : "negative",
          },
          {
            name: "Flight Risk",
            score: getScoreValue(flightRiskLevel),
            weight: weights.flightRisk,
            weightedScore: getScoreValue(flightRiskLevel) * weights.flightRisk,
            direction: flightRiskLevel === "low" ? "positive" : "negative",
          },
          {
            name: "Severity of Charges",
            score: getScoreValue(severityLevel),
            weight: weights.severityOfCharges,
            weightedScore:
              getScoreValue(severityLevel) * weights.severityOfCharges,
            direction: severityLevel === "low" ? "positive" : "negative",
          },
          {
            name: "Social/Economic Background",
            score: getScoreValue(socialLevel),
            weight: weights.socialEconomic,
            weightedScore: getScoreValue(socialLevel) * weights.socialEconomic,
            direction: socialLevel === "low" ? "positive" : "negative",
          },
        ];

        const overallScore = factors.reduce(
          (sum, factor) => sum + factor.weightedScore,
          0
        );

        let riskLevel;
        if (overallScore < 1.5) {
          riskLevel = "Low";
        } else if (overallScore < 2.5) {
          riskLevel = "Medium";
        } else {
          riskLevel = "High";
        }

        // Generate recommendation based on risk level
        let recommendation;
        switch (riskLevel) {
          case "Low":
            recommendation = `The accused ${applicant.firstName} ${applicant.lastName} presents a low risk level. Consider granting bail with standard conditions such as regular reporting to the police station.`;
            break;
          case "Medium":
            recommendation = `The accused ${applicant.firstName} ${applicant.lastName} presents a medium risk level. Consider imposing conditions such as regular reporting to the police station, surrender of passport, and a substantial surety bond.`;
            break;
          case "High":
            recommendation = `The accused ${applicant.firstName} ${applicant.lastName} presents a high risk level. Bail may not be recommended due to significant flight risk, severity of charges, and/or criminal history. If bail is considered, strict conditions should be imposed.`;
            break;
        }

        // Create similar cases
        const similarCases = [];
        for (let j = 0; j < 4; j++) {
          similarCases.push({
            caseNumber: `BA-${Math.floor(Math.random() * 500) + 1}/${
              2022 - Math.floor(Math.random() * 3)
            }`,
            court: getRandomElement(courts),
            outcome: Math.random() > 0.5 ? "Approved" : "Rejected",
            similarity: Math.floor(Math.random() * 20) + 70, // Random similarity between 70-90%
          });
        }

        const riskAssessment = new RiskAssessment({
          caseId: savedCase._id,
          applicantId: applicant._id,
          assessedBy: lawyer._id,
          assessmentDate: randomDate(filingDate, new Date()),
          overallScore,
          riskLevel,
          factors,
          criminalHistory: {
            level: criminalHistoryLevel,
            details: `${
              criminalHistoryLevel === "low"
                ? "No"
                : criminalHistoryLevel === "medium"
                ? "Some"
                : "Extensive"
            } prior criminal record`,
          },
          flightRisk: {
            level: flightRiskLevel,
            details: `${
              flightRiskLevel === "low"
                ? "Strong"
                : flightRiskLevel === "medium"
                ? "Moderate"
                : "Weak"
            } community ties`,
          },
          severityOfCharges: {
            level: severityLevel,
            details: `${
              severityLevel === "low"
                ? "Minor"
                : severityLevel === "medium"
                ? "Moderate"
                : "Serious"
            } offense`,
          },
          socialEconomicBackground: {
            level: socialLevel,
            details: `${
              socialLevel === "low"
                ? "Stable"
                : socialLevel === "medium"
                ? "Moderate"
                : "Unstable"
            } social and economic background`,
          },
          recommendation,
          similarCases,
        });

        const savedAssessment = await riskAssessment.save();

        // Update case with risk assessment reference
        savedCase.riskAssessment = savedAssessment._id;
        await savedCase.save();
      }

      // Create hearings for each case
      if (status !== "Pending") {
        const hearingCount = Math.floor(Math.random() * 3) + 1; // 1-3 hearings

        for (let j = 0; j < hearingCount; j++) {
          const hearingDate = randomDate(
            filingDate,
            new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)
          ); // Up to 30 days in future
          const hearingStatus =
            hearingDate < new Date()
              ? getRandomElement(["Completed", "Adjourned"])
              : "Scheduled";

          const hearing = new Hearing({
            caseId: savedCase._id,
            date: hearingDate,
            time: `${Math.floor(Math.random() * 8) + 10}:${
              Math.random() > 0.5 ? "00" : "30"
            } ${Math.random() > 0.5 ? "AM" : "PM"}`,
            court,
            judge: judge._id,
            status: hearingStatus,
            purpose: "Bail hearing",
            notes:
              hearingStatus === "Completed"
                ? "Hearing completed as scheduled"
                : "",
            outcome:
              hearingStatus === "Completed"
                ? status === "Approved"
                  ? "Bail approved with conditions"
                  : status === "Rejected"
                  ? "Bail application rejected"
                  : ""
                : "",
            attendees: [
              {
                user: applicant._id,
                role: "Applicant",
                attended: hearingStatus === "Completed",
              },
              {
                user: lawyer._id,
                role: "Lawyer",
                attended: hearingStatus === "Completed",
              },
              {
                user: judge._id,
                role: "Judge",
                attended: hearingStatus === "Completed",
              },
            ],
          });

          const savedHearing = await hearing.save();

          // Update case with hearing reference
          savedCase.hearings.push(savedHearing._id);
          await savedCase.save();
        }
      }
    }

    console.log("Seed data created successfully");
  } catch (error) {
    console.error("Error seeding data:", error);
    throw error;
  }
};

module.exports = seedData;
