// data/topicsData.js — Local seed data for all aptitude topics

export const TOPICS = [
  {
    slug: "percentages",
    name: "Percentages",
    category: "Arithmetic",
    explanation:
      "Percentage means 'per hundred'. It is used to express a number as a fraction of 100. Percentages are widely used in profit/loss, discounts, and data interpretation.",
    formulas: [
      "Percentage = (Value / Total Value) × 100",
      "Percentage Increase = [(New - Old) / Old] × 100",
      "Percentage Decrease = [(Old - New) / Old] × 100",
      "Value = (Percentage × Total) / 100",
    ],
    shortcuts: [
      "To find x% of y, compute y × x / 100",
      "If A is x% more than B, then B is [x/(100+x)] × 100 % less than A",
      "Successive % change: use formula (a + b + ab/100)%",
    ],
    questions: [
      {
        id: 1,
        question: "What is 35% of 480?",
        options: ["A) 168", "B) 172", "C) 176", "D) 180"],
        answer: "A",
        explanation: "35/100 × 480 = 168",
      },
      {
        id: 2,
        question: "A price increases from ₹200 to ₹250. What is the percentage increase?",
        options: ["A) 20%", "B) 25%", "C) 30%", "D) 15%"],
        answer: "B",
        explanation: "(250-200)/200 × 100 = 25%",
      },
      {
        id: 3,
        question: "If 60% of a number is 90, what is the number?",
        options: ["A) 140", "B) 150", "C) 160", "D) 145"],
        answer: "B",
        explanation: "Number = 90 / 0.6 = 150",
      },
    ],
  },
  {
    slug: "profit-and-loss",
    name: "Profit and Loss",
    category: "Arithmetic",
    explanation:
      "Profit and Loss concepts deal with cost price, selling price, profit percentage, and loss percentage. These are fundamental for commerce and competitive exams.",
    formulas: [
      "Profit = Selling Price (SP) − Cost Price (CP)",
      "Loss = CP − SP",
      "Profit% = (Profit / CP) × 100",
      "Loss% = (Loss / CP) × 100",
      "SP = CP × (100 + Profit%) / 100",
      "CP = SP × 100 / (100 + Profit%)",
    ],
    shortcuts: [
      "If SP > CP → Profit; If CP > SP → Loss",
      "Marked Price discount: SP = MP × (100 - Discount%) / 100",
      "Two articles same SP, one at x% profit and other at x% loss → always a net loss of (x²/100)%",
    ],
    questions: [
      {
        id: 1,
        question: "A book is bought for ₹150 and sold for ₹180. What is the profit percentage?",
        options: ["A) 15%", "B) 20%", "C) 25%", "D) 10%"],
        answer: "B",
        explanation: "Profit = 30, Profit% = 30/150 × 100 = 20%",
      },
      {
        id: 2,
        question: "If CP = ₹500 and Loss% = 10%, find SP.",
        options: ["A) ₹400", "B) ₹450", "C) ₹480", "D) ₹550"],
        answer: "B",
        explanation: "SP = 500 × 90/100 = ₹450",
      },
    ],
  },
  {
    slug: "simple-interest",
    name: "Simple Interest",
    category: "Arithmetic",
    explanation:
      "Simple Interest is calculated on the original principal only. It grows linearly with time, unlike compound interest which grows exponentially.",
    formulas: [
      "SI = (P × R × T) / 100",
      "Amount (A) = P + SI",
      "Principal P = (SI × 100) / (R × T)",
      "Rate R = (SI × 100) / (P × T)",
      "Time T = (SI × 100) / (P × R)",
    ],
    shortcuts: [
      "SI doubles if R or T doubles",
      "If SI = P, then RT = 100",
      "For 2 years at R%, SI = 2PR/100",
    ],
    questions: [
      {
        id: 1,
        question: "Find SI on ₹2000 at 5% per annum for 3 years.",
        options: ["A) ₹200", "B) ₹250", "C) ₹300", "D) ₹350"],
        answer: "C",
        explanation: "SI = 2000 × 5 × 3 / 100 = ₹300",
      },
    ],
  },
  {
    slug: "compound-interest",
    name: "Compound Interest",
    category: "Arithmetic",
    explanation:
      "Compound Interest is calculated on the principal plus accumulated interest. Unlike Simple Interest, the base grows each period, making CI grow exponentially. Used in bank FDs, loans, and investments.",
    formulas: [
      "A = P × (1 + R/100)^T",
      "CI = A − P",
      "Half-yearly: A = P × (1 + R/200)^(2T)",
      "Quarterly: A = P × (1 + R/400)^(4T)",
      "CI − SI for 2 years = P × (R/100)²",
    ],
    shortcuts: [
      "Rule of 72: Years to double ≈ 72 / R%",
      "CI > SI always for same P, R, T > 1 year",
      "For 2 years: CI = SI + SI²/(100P) effectively",
    ],
    questions: [
      {
        id: 1,
        question: "CI on ₹10,000 at 10% per annum for 2 years?",
        options: ["A) ₹2000", "B) ₹2100", "C) ₹2200", "D) ₹1900"],
        answer: "B",
        explanation: "A = 10000 × (1.1)² = 12100; CI = ₹2100",
      },
    ],
  },
  {
    slug: "averages",
    name: "Averages",
    category: "Arithmetic",
    explanation:
      "Average (Arithmetic Mean) is the sum of all values divided by the count of values. It is commonly tested in exams involving data sets and weighted averages.",
    formulas: [
      "Average = Sum of values / Number of values",
      "Sum = Average × Count",
      "Weighted Average = Σ(w_i × x_i) / Σw_i",
      "New Average after adding value x: (old sum + x) / (n+1)",
    ],
    shortcuts: [
      "Average of n consecutive integers starting at a: a + (n-1)/2",
      "If average increases by k on adding a number, new number = old avg + k(n+1)",
    ],
    questions: [
      {
        id: 1,
        question: "Average of 5 numbers is 40. One number is 60. Average of rest?",
        options: ["A) 32", "B) 35", "C) 30", "D) 36"],
        answer: "B",
        explanation: "Total = 200; Remaining 4 numbers total = 200-60 = 140; Avg = 35",
      },
    ],
  },
  {
    slug: "number-systems",
    name: "Number Systems",
    category: "Arithmetic",
    explanation:
      "Number Systems cover natural numbers, integers, rational/irrational numbers, divisibility rules, and properties essential for all aptitude exams.",
    formulas: [
      "LCM × HCF = Product of two numbers",
      "Sum of 1 to n = n(n+1)/2",
      "Sum of squares 1 to n = n(n+1)(2n+1)/6",
      "Sum of cubes 1 to n = [n(n+1)/2]²",
    ],
    shortcuts: [
      "Divisibility by 3: digit sum divisible by 3",
      "Divisibility by 9: digit sum divisible by 9",
      "Divisibility by 11: alternating digit sum divisible by 11",
    ],
    questions: [
      {
        id: 1,
        question: "Which of the following is divisible by 11?",
        options: ["A) 121", "B) 123", "C) 125", "D) 127"],
        answer: "A",
        explanation: "121: alternating sum = 1-2+1 = 0, divisible by 11",
      },
    ],
  },
  {
    slug: "permutations-and-combinations",
    name: "Permutations & Combinations",
    category: "Algebra",
    explanation:
      "Permutations count arrangements (order matters); Combinations count selections (order doesn't matter). Essential for probability and counting problems.",
    formulas: [
      "nPr = n! / (n-r)!",
      "nCr = n! / [r! × (n-r)!]",
      "nCr = nC(n-r)",
      "nC0 = nCn = 1",
      "Sum of all nCr (r=0 to n) = 2^n",
    ],
    shortcuts: [
      "nCr = nPr / r!",
      "Circular arrangements = (n-1)!",
      "Identical objects: n! / (p! × q! × ...) for repeated items",
    ],
    questions: [
      {
        id: 1,
        question: "How many ways can 5 people be arranged in a row?",
        options: ["A) 60", "B) 100", "C) 120", "D) 150"],
        answer: "C",
        explanation: "5P5 = 5! = 120",
      },
    ],
  },
  {
    slug: "algebra",
    name: "Algebra",
    category: "Algebra",
    explanation:
      "Algebra involves solving equations with variables. Key areas include linear equations, quadratic equations, inequalities, and algebraic identities.",
    formulas: [
      "(a+b)² = a² + 2ab + b²",
      "(a-b)² = a² - 2ab + b²",
      "a² - b² = (a+b)(a-b)",
      "(a+b)³ = a³ + 3a²b + 3ab² + b³",
      "Quadratic: x = [-b ± √(b²-4ac)] / 2a",
    ],
    shortcuts: [
      "If x + 1/x = k, then x² + 1/x² = k² − 2",
      "Sum of roots = −b/a; Product = c/a (quadratic)",
    ],
    questions: [
      {
        id: 1,
        question: "If x + y = 10 and xy = 24, find x² + y².",
        options: ["A) 52", "B) 54", "C) 60", "D) 48"],
        answer: "A",
        explanation: "x²+y² = (x+y)² − 2xy = 100 − 48 = 52",
      },
    ],
  },
  {
    slug: "geometry",
    name: "Geometry",
    category: "Geometry",
    explanation:
      "Geometry covers shapes, areas, volumes, and properties of triangles, circles, polygons, and solids. Mensuration is a major sub-topic.",
    formulas: [
      "Circle: Area = πr², Circumference = 2πr",
      "Triangle: Area = ½ × base × height",
      "Rectangle: Area = l × b, Perimeter = 2(l+b)",
      "Sphere: Volume = (4/3)πr³, Surface = 4πr²",
      "Cylinder: Volume = πr²h, CSA = 2πrh",
    ],
    shortcuts: [
      "Angle in semicircle = 90°",
      "Pythagoras: a² + b² = c² (right triangle)",
      "Triangle inequality: sum of any two sides > third",
    ],
    questions: [
      {
        id: 1,
        question: "Area of a circle with radius 7 cm (π = 22/7)?",
        options: ["A) 154 cm²", "B) 144 cm²", "C) 140 cm²", "D) 132 cm²"],
        answer: "A",
        explanation: "Area = (22/7) × 7 × 7 = 154 cm²",
      },
    ],
  },
  {
    slug: "pipes-and-cisterns",
    name: "Pipes & Cisterns",
    category: "Work & Speed",
    explanation:
      "Pipes and Cisterns problems follow the same logic as Time and Work. Filling pipes add to the rate; draining pipes subtract. The LCM method makes solving faster.",
    formulas: [
      "Net rate = Sum of filling rates − Sum of draining rates",
      "Time to fill = Total capacity / Net rate",
      "Two pipes together: Time = (A × B) / (A + B)",
      "If pipe fills in x hrs and drains in y hrs: Net time = xy / (y − x)",
    ],
    shortcuts: [
      "Assign total capacity = LCM of all pipe times",
      "Filling pipe → positive rate; Drain pipe → negative rate",
      "If a pipe fills tank in x hrs, it fills 1/x of the tank per hour",
    ],
    questions: [
      {
        id: 1,
        question: "Pipe A fills a tank in 6 hrs, Pipe B in 12 hrs. Together they fill in?",
        options: ["A) 3 hrs", "B) 4 hrs", "C) 5 hrs", "D) 6 hrs"],
        answer: "B",
        explanation: "Combined rate = 1/6 + 1/12 = 3/12 = 1/4. Time = 4 hrs",
      },
    ],
  },
  {
    slug: "areas",
    name: "Areas",
    category: "Geometry",
    explanation:
      "Areas and Mensuration covers calculating area, perimeter, surface area, and volume of 2D and 3D shapes. These are directly tested in almost all competitive exams.",
    formulas: [
      "Square: Area = a², Perimeter = 4a",
      "Rectangle: Area = l × b, Perimeter = 2(l+b)",
      "Triangle: Area = ½ × b × h  |  Heron's: √[s(s-a)(s-b)(s-c)]",
      "Circle: Area = πr², Circumference = 2πr",
      "Trapezium: Area = ½ × (a+b) × h",
    ],
    shortcuts: [
      "Area of equilateral triangle = (√3/4) × a²",
      "Diagonal of square = a√2; diagonal of rectangle = √(l²+b²)",
      "If radius doubles, area becomes 4 times",
    ],
    questions: [
      {
        id: 1,
        question: "Perimeter of a rectangle with l=12cm and b=8cm?",
        options: ["A) 36 cm", "B) 40 cm", "C) 44 cm", "D) 48 cm"],
        answer: "B",
        explanation: "Perimeter = 2(12+8) = 2×20 = 40 cm",
      },
    ],
  },
  {
    slug: "hcf-and-lcm",
    name: "HCF and LCM",
    category: "Arithmetic",
    explanation:
      "HCF (Highest Common Factor) is the largest number that divides two or more numbers exactly. LCM (Lowest Common Multiple) is the smallest number divisible by all given numbers.",
    formulas: [
      "HCF × LCM = Product of two numbers",
      "HCF of fractions = HCF of numerators / LCM of denominators",
      "LCM of fractions = LCM of numerators / HCF of denominators",
    ],
    shortcuts: [
      "To find HCF: use prime factorisation — take lowest powers",
      "To find LCM: use prime factorisation — take highest powers",
      "HCF always ≤ LCM; HCF divides LCM exactly",
    ],
    questions: [
      {
        id: 1,
        question: "LCM of 12 and 18 is?",
        options: ["A) 24", "B) 36", "C) 48", "D) 72"],
        answer: "B",
        explanation: "12 = 2²×3, 18 = 2×3². LCM = 2²×3² = 36",
      },
    ],
  },
  {
    slug: "discounts",
    name: "Discounts",
    category: "Arithmetic",
    explanation:
      "Discounts are reductions applied on the Marked Price (MP) of an item. The Selling Price after discount is what the customer pays. Discount is always calculated on MP, not CP.",
    formulas: [
      "Discount = Marked Price − Selling Price",
      "Discount% = (Discount / MP) × 100",
      "SP = MP × (100 − Discount%) / 100",
      "Successive discounts a% and b%: effective = a + b − (ab/100)",
    ],
    shortcuts: [
      "Discount is always on Marked Price; Profit/Loss is always on Cost Price",
      "Two successive discounts of 10% and 20% ≠ 30%; effective = 28%",
      "To maximise profit: maximise (SP − CP), which depends on both MP and CP",
    ],
    questions: [
      {
        id: 1,
        question: "A shirt with MP ₹500 is sold at 20% discount. Find the SP.",
        options: ["A) ₹380", "B) ₹400", "C) ₹420", "D) ₹450"],
        answer: "B",
        explanation: "SP = 500 × (100−20)/100 = 500 × 0.8 = ₹400",
      },
    ],
  },
  {
    slug: "mixture-and-alligation",
    name: "Mixture & Alligation",
    category: "Arithmetic",
    explanation:
      "Mixture and Alligation is used to find the ratio in which two or more ingredients must be mixed to get a desired average price or concentration. Alligation is the shortcut method for mixture problems.",
    formulas: [
      "Alligation rule: (d − m) : (m − c) where c=cheaper, d=dearer, m=mean price",
      "Final concentration after replacement: C × (1 − x/V)^n",
      "Weighted average: (C1×Q1 + C2×Q2) / (Q1+Q2)",
    ],
    shortcuts: [
      "Draw the alligation cross: place cheaper (top-left), dearer (top-right), mean (center)",
      "The ratio of mixing = difference of opposite diagonals",
      "Repeated dilution formula: Final = Initial × (1 − removed/total)^n",
    ],
    questions: [
      {
        id: 1,
        question: "In what ratio must tea at ₹40/kg be mixed with tea at ₹60/kg to get a blend at ₹50/kg?",
        options: ["A) 1:1", "B) 2:1", "C) 1:2", "D) 3:2"],
        answer: "A",
        explanation: "Alligation: (60−50):(50−40) = 10:10 = 1:1",
      },
    ],
  },
  {
    slug: "ratio-and-proportion",
    name: "Ratio and Proportion",
    category: "Arithmetic",
    explanation:
      "A ratio compares two quantities. A proportion states two ratios are equal. These are used in dividing amounts, partnerships, mixing, and scale problems.",
    formulas: [
      "Ratio: a : b = a/b",
      "Cross Multiplication: if a/b = c/d, then a×d = b×c",
      "Dividing N in ratio a:b → Parts are Na/(a+b) and Nb/(a+b)",
      "Compounded Ratio of a:b and c:d = ac : bd",
    ],
    shortcuts: [
      "To combine A:B and B:C → make B equal in both by multiplying",
      "Inverse ratio of a:b is b:a",
      "Partnership profit split = ratio of (Capital × Time) for each partner",
    ],
    questions: [
      {
        id: 1,
        question: "Divide ₹1200 between A and B in ratio 3:5. B's share?",
        options: ["A) ₹600", "B) ₹700", "C) ₹750", "D) ₹800"],
        answer: "C",
        explanation: "B's share = (5/8) × 1200 = ₹750",
      },
    ],
  },
  {
    slug: "time-speed-distance",
    name: "Time, Speed & Distance",
    category: "Work & Speed",
    explanation:
      "Speed, Distance, and Time are interrelated through Distance = Speed × Time. Problems cover average speed, trains, boats in streams, and relative speed.",
    formulas: [
      "Distance = Speed × Time",
      "Average Speed (equal distance) = 2uv / (u + v)",
      "Relative Speed (opposite) = S1 + S2",
      "Relative Speed (same direction) = |S1 − S2|",
      "Boat upstream = B − W  |  Downstream = B + W",
    ],
    shortcuts: [
      "km/h to m/s: multiply by 5/18",
      "m/s to km/h: multiply by 18/5",
      "Average speed ≠ (u+v)/2 for equal distance — use 2uv/(u+v)",
    ],
    questions: [
      {
        id: 1,
        question: "A train 250m long crosses a pole in 10 seconds. Speed in km/h?",
        options: ["A) 72", "B) 80", "C) 90", "D) 100"],
        answer: "C",
        explanation: "Speed = 250/10 = 25 m/s = 25×18/5 = 90 km/h",
      },
    ],
  },
  {
    slug: "time-and-work",
    name: "Time and Work",
    category: "Work & Speed",
    explanation:
      "If someone takes N days to finish a job, they complete 1/N of it per day. When multiple people work together, their daily rates add up. The LCM method simplifies calculations.",
    formulas: [
      "1 person's 1-day work = 1 / Total days",
      "Combined rate = 1/A + 1/B",
      "Time for 2 together = (A × B) / (A + B)",
      "Work done in t days = t / A",
    ],
    shortcuts: [
      "LCM Method: set Total Work = LCM of all days; daily output = Work / Days",
      "If A is twice as efficient as B, A takes half B's time",
      "If A+B finish in y days and A alone in x days, B alone = xy/(x−y)",
    ],
    questions: [
      {
        id: 1,
        question: "A does a job in 12 days, B in 18 days. Together they finish in?",
        options: ["A) 6 days", "B) 7 days", "C) 7.2 days", "D) 8 days"],
        answer: "C",
        explanation: "Time = (12×18)/(12+18) = 216/30 = 7.2 days",
      },
    ],
  },
];

// Category groupings for display
export const CATEGORIES = [
  "Arithmetic",
  "Work & Speed",
  "Algebra",
  "Geometry",
];

// Quick lookup by slug
export const getTopicBySlug = (slug) =>
  TOPICS.find((t) => t.slug === slug) || null;
