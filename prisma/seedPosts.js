import { prisma } from '../config/prisma.js';

// Get current date
const now = new Date();

// Generate random dates for posts (between 30 days in past and 30 days in future)
const generateRandomDate = () => {
  // Offset between -30 and +30 days from now
  const offsetDays = Math.floor(Math.random() * 61) - 30;
  const offsetMs = offsetDays * 24 * 60 * 60 * 1000;
  return new Date(now.getTime() + offsetMs);
};

// Generate a random comment date that's after the post date
const generateRandomCommentDate = (postDate) => {
  const postTime = postDate.getTime();
  // Random time between post date and now (max 14 days after post)
  const maxOffset = Math.min(
    now.getTime() - postTime, // Don't go beyond current time
    14 * 24 * 60 * 60 * 1000  // Max 14 days after post
  );
  
  // If post date is in future, return the post date (no comments yet)
  if (maxOffset <= 0) return postDate;
  
  // Generate random offset (0 to maxOffset)
  const randomOffset = Math.floor(Math.random() * maxOffset);
  return new Date(postTime + randomOffset);
};

// Blog post content - each with at least 300 words
const blogPosts = [
  {
    "title": "Getting Started with Meditation",
    "published": true,
    "body": `Meditation has transformed my daily routine in ways I never anticipated when I first began this practice. Just 10 minutes each morning helps me stay centered throughout the day, creating a foundation of calm that impacts everything I do. I start by finding a quiet space where I won't be disturbed, sitting comfortably with my back straight but not rigid, and focusing on my breath. When thoughts arise, I acknowledge them without judgment and gently return to my breathing.
        After a month of consistent practice, I've noticed improved focus, better stress management, and more restful sleep. The benefits extend beyond those moments of meditation, influencing how I respond to challenges and interact with others. If you're new to meditation, try using a guided app to help establish your routine.
        Many beginners find it challenging to quiet their minds, expecting that meditation means having no thoughts at all. This is a common misconception. The practice isn't about eliminating thoughts but rather about changing our relationship with them. Think of your mind as a busy highway with cars (thoughts) constantly passing by. Instead of trying to stop the traffic, you're simply sitting beside the road, acknowledging the cars without getting into them.
        Start with just five minutes daily and gradually increase your time. Consistency matters more than duration, especially when developing a new habit. Choose a specific time of day for your practice—many find that mornings work best before the day's demands take over. Create a dedicated space with minimal distractions, perhaps with a cushion or chair that supports good posture.
        Experiment with different meditation techniques to discover what resonates with you. Breath-focused meditation involves following the natural rhythm of your inhalations and exhalations. Body scan meditation guides your attention systematically through different parts of your body, noticing sensations without trying to change them. Loving-kindness meditation cultivates feelings of goodwill toward yourself and others.
        Technology can be a helpful ally in developing your practice. Apps like Headspace, Calm, and Insight Timer offer guided sessions for various experience levels and purposes. Many also include features that track your progress and send gentle reminders.
        Remember that meditation is a personal journey. What works for someone else might not work for you, and that's perfectly fine. Approach the practice with curiosity rather than judgment, allowing yourself to explore and adjust as needed. Some days will feel easier than others, and that's part of the process too.
        The science behind meditation's benefits continues to grow, with research showing positive effects on brain structure, immune function, and emotional regulation. However, don't let expectations of specific outcomes become another source of stress. Simply showing up for yourself each day is valuable in itself.
        `,
    "comments": [
      {
        "body": "This is exactly what I needed to read today! I've been wanting to start meditating but wasn't sure how. Thanks for the simple approach."
      },
      {
        "body": "Which meditation apps would you recommend for beginners? I've tried a few but found them too advanced."
      },
      {
        "body": "Do you find morning meditation more effective than evening sessions? I've been meditating before bed but still struggle with sleep."
      }
    ]
  },
  {
    "title": "Quick Weeknight Pasta Recipe",
    "published": false,
    "body": `This simple pasta dish has become my go-to for busy weeknights when I need something delicious but don't have the energy for elaborate cooking. The combination of fresh ingredients and minimal preparation time makes it perfect for those evenings when you want something satisfying without the fuss.
        Start by boiling your favorite pasta according to package instructions. I prefer linguine or spaghetti for this recipe, but any pasta shape works well. While it cooks, sauté three cloves of minced garlic and a pinch of chili flakes in about three tablespoons of good quality olive oil. The key is to keep the heat medium-low to infuse the oil without burning the garlic, which only takes about two minutes.
        Then add a pint of halved cherry tomatoes to the garlic oil. Let them cook until they begin to soften and burst, releasing their juices to create a light sauce. This usually takes about five minutes. Season with sea salt and freshly ground black pepper to taste.
        When the pasta is al dente, drain it, reserving about half a cup of the starchy cooking water. Add the pasta directly to the pan with the tomatoes, tossing well to coat. Add a splash of the reserved cooking water, which helps create a silky sauce that clings to the pasta. Finish with a handful of torn fresh basil leaves and a generous grating of Parmesan cheese.
        The entire meal comes together in under 20 minutes and tastes like something from a restaurant. The beauty of this dish lies in its versatility. You can easily customize it with whatever vegetables you have on hand. Sometimes I add baby spinach in the last minute of cooking, allowing it to wilt gently into the pasta. Other times, I'll toss in some black olives or capers for a briny kick.
        For protein, you could add a can of drained and rinsed white beans, some flaked canned tuna, or leftover rotisserie chicken. If you happen to have some heavy cream, a small splash added just before the pasta transforms this into a creamy tomato sauce that's absolutely divine.
        The simplicity of this dish reminds me that good cooking doesn't have to be complicated or time-consuming. Quality ingredients treated simply often yield the most satisfying meals. This pasta has saved me on countless busy evenings when takeout seemed the only option.
        I find this dish particularly perfect for those nights when you're cooking for one or two people. It scales easily if you have more mouths to feed, and leftovers keep well for lunch the next day, though you might want to add a splash of water when reheating to loosen the sauce.
        What I love most about simple recipes like this is how they encourage improvisation. Once you understand the basic technique, you can adapt it endlessly according to your preferences and what's available in your pantry. Cooking becomes less about following strict instructions and more about understanding how flavors work together.
        This pasta dish epitomizes what weeknight cooking should be: quick, flexible, and satisfying enough to make you look forward to dinner, even after a long day. It's proof that good food doesn't require hours in the kitchen or a long list of ingredients.`,
    "comments": [
      {
        "body": "Made this last night and it was delicious! Added some spinach and it worked perfectly."
      },
      {
        "body": "Has anyone tried this with gluten-free pasta? Wondering if it works just as well."
      },
      {
        "body": "This is a lifesaver for weeknight dinners with kids. They loved it and asked for seconds!"
      },
      {
        "body": "Any idea on the approximate calorie count per serving? Trying to track my intake."
      }
    ]
  },
  {
    "title": "Minimalism Changed My Life",
    "published": true,
    "body": `Six months ago, I decided to embrace minimalism after feeling overwhelmed by clutter and constant consumption. What began as a simple decluttering project evolved into a profound lifestyle shift that has affected every aspect of my daily existence. The journey wasn't always easy, but the results have transformed my perspective on possessions, time, and what truly matters.
        I started by donating items I hadn't used in over a year, then gradually evaluated each possession by asking if it served a purpose or brought me genuine joy. This process was surprisingly emotional. Objects I'd been holding onto for years—"just in case" items, sentimental clutter, aspirational purchases—all required honest assessment. Many things I'd thought were important turned out to be burdens in disguise, taking up not just physical space but mental energy as well.
        The physical decluttering led to mental clarity I hadn't expected or even been seeking. With fewer distractions at home, I found more time for hobbies and relationships that had been neglected. My living space became a sanctuary rather than a source of stress. Cleaning became simpler with fewer objects to manage, giving me back hours each week. The visual calm of uncluttered spaces helped quiet my mind when I walked through the door after busy days.
        My spending habits have changed dramatically too. I now consider purchases carefully rather than buying on impulse. Before acquiring something new, I ask myself a series of questions: Do I truly need this? Will it add value to my life? Do I already own something that serves the same purpose? Where will I store it? What's the cost beyond money—in terms of maintenance, cleaning, and mental load? This deliberate approach to consumption has saved me money and prevented the accumulation of new clutter.
        Minimalism isn't about deprivation or living with nothing; it's about making room for what truly matters. I still own things I love—books that inspire me, kitchen tools that make cooking enjoyable, art that brings beauty to my space. The difference is that everything I keep has earned its place through usefulness or joy, not default or acquisition for its own sake.
        This philosophy has extended beyond physical possessions. I've become more intentional with my time, reducing digital clutter and unnecessary commitments. I unsubscribed from dozens of email lists that were filling my inbox with shopping temptations. I became more selective about social media consumption, muting accounts that triggered dissatisfaction or comparison. My calendar now has breathing room between engagements rather than being packed with obligations that left me exhausted.
        Relationships have deepened as I've prioritized meaningful connections over superficial networking. I spend more quality time with fewer people, finding greater satisfaction in these interactions. Conversations have become richer without the constant distraction of notifications or the pressure to be everywhere at once.
        The environmental impact of my changed habits has been significant as well. Buying less means less waste, fewer resources consumed, and a lighter footprint on the planet. Repairing items rather than replacing them, choosing quality over quantity, and borrowing instead of buying all contribute to more sustainable living.
        Minimalism isn't a destination but an ongoing practice. I still have moments of wanting to acquire things I don't need or holding onto items past their usefulness. The difference is awareness—I recognize these impulses for what they are and can usually redirect them. The freedom gained from living with less far outweighs the momentary pleasure of a new purchase.
        If you're considering a minimalist approach, start small. Clear one drawer, one shelf, or one category of items. Notice how it feels to have that space simplified, and let the satisfaction motivate your next step. There's no need to transform your entire home overnight. Gradual, intentional changes are more likely to last than dramatic purges followed by shopping rebounds.
        Remember that your version of minimalism doesn't have to look like anyone else's. The point isn't to live with a specific number of items or in a particular aesthetic style. It's about discovering what "enough" means for you and creating space—physical and mental—for what brings genuine value to your life.`,
    "comments": [
      {
        "body": "The mental clarity part resonates so much! It's amazing how physical space affects our mindset."
      },
      {
        "body": "I'm struggling with letting go of sentimental items. Any advice for someone just starting this journey?"
      }
    ]
  },
  {
    "title": "The Art of Productive Morning Routines",
    "published": true,
    "body": `Transforming my morning routine has been one of the most impactful changes I've made in recent years. What once was a chaotic rush of hitting snooze buttons, skipping breakfast, and racing out the door has evolved into a deliberate sequence that sets a positive tone for the entire day. The benefits have rippled through my work performance, health, and overall wellbeing in ways I never anticipated.
        My journey began after reading about the morning habits of successful people across various fields. While their specific activities differed, the common thread was intentionality—taking ownership of those first waking hours rather than reacting to external demands. I decided to experiment with my own routine, testing different approaches to find what worked for my body, schedule, and goals.
        The first change was setting a consistent wake-up time, even on weekends. This wasn't easy for someone who treasured sleeping in, but I gradually adjusted by going to bed earlier and moving my alarm back in 15-minute increments. Consistency helped regulate my body's internal clock, making it easier to wake naturally, often before my alarm sounds. This alone improved my energy levels significantly.
        Next came the elimination of phone use for the first hour after waking. Previously, I'd reach for my device immediately, scrolling through emails and social media while still in bed. This habit instantly put me in a reactive state, responding to others' needs and information before attending to my own wellbeing. Now my phone stays in another room overnight, with a traditional alarm clock replacing its morning function.
        With technology removed from the equation, I created space for practices that center and energize me. Five minutes of meditation helps clear mental fog and set intentions for the day. Twenty minutes of gentle movement—usually yoga or stretching—awakens my body without the stress of intense exercise. Preparing and enjoying a nutritious breakfast while reading something inspirational provides fuel for both body and mind.
        Hydration plays a crucial role as well. A large glass of water with lemon first thing helps rehydrate after hours of sleep and stimulates digestion. I follow this with green tea rather than immediately reaching for coffee, which I save for after breakfast to avoid the cortisol spike that can come from consuming caffeine on an empty stomach.
        Planning is another key component of my routine. Taking ten minutes to review my calendar and prioritize tasks ensures I approach the day strategically rather than reactively. I identify my three most important tasks, which receive my focus during peak energy hours before less critical responsibilities.
        Writing has become a non-negotiable part of my mornings. Whether journaling about ideas, expressing gratitude, or working on creative projects, putting thoughts on paper helps clarify thinking and process emotions before the day's demands take over. Some of my best professional insights have emerged during these unstructured writing sessions.
        Perhaps the most significant benefit of this routine has been the shift from feeling rushed and behind before the day even begins to starting with a sense of accomplishment and control. By investing in myself first, I approach work and interactions from a place of fullness rather than depletion.
        The transition wasn't without challenges. Establishing new habits requires commitment through the inevitable rough patches—the mornings when you want nothing more than to return to old patterns. I found it helpful to start with small changes, building gradually rather than attempting a complete overhaul overnight. I also learned to adapt rather than abandon the routine when circumstances change, such as during travel or illness.
        Some might question whether dedicating up to two hours to morning activities is realistic given professional and family responsibilities. I've found that waking earlier to accommodate this time is worthwhile, but the routine can be scaled according to individual circumstances. Even 30 minutes of intentional morning activities can yield significant benefits compared to rushing from sleep straight into external obligations.
        The beauty of a personal morning routine is that it can be tailored to individual needs and preferences. Some people thrive with intensive exercise first thing, while others need quiet contemplation. Some benefit from social connection over breakfast, while others require solitude. The specific activities matter less than the intention behind them and the consistency with which they're practiced.
        Ultimately, reclaiming your mornings means reclaiming agency over your life. In a world that constantly demands our attention and energy, these first waking hours offer a precious opportunity to determine how we want to show up rather than simply responding to what comes our way. This daily practice of intentionality has become a foundation for greater purpose and satisfaction across all areas of life.`,
    "comments": [
      {
        "body": "I've been trying to establish a morning routine for years but always give up after a few days. Any tips for staying consistent?"
      },
      {
        "body": "Do you find it difficult to maintain this routine when traveling? I struggle with keeping habits when my environment changes."
      },
      {
        "body": "The point about staying off phones first thing is so important. I started doing this and it's been game-changing for my anxiety levels."
      }
    ]
  },
  {
    "title": "Understanding the Basics of Personal Finance",
    "published": true,
    "body": `The world of personal finance can seem overwhelming, especially for those of us who never received formal education on the subject. Yet understanding how to manage money effectively is one of the most important skills for building a stable and secure life. Over the past few years, I've dedicated myself to learning these principles through books, courses, and sometimes costly trial and error. I'm sharing what I've learned in hopes of making this crucial knowledge more accessible.
        The foundation of financial stability begins with creating and maintaining a budget. This doesn't mean restricting yourself from ever enjoying life's pleasures; rather, it's about making conscious decisions regarding your resources. Start by tracking all expenses for a month, categorizing them as needs (housing, food, utilities, transportation), wants (entertainment, dining out, subscriptions), and savings/debt payments. Many people are surprised to discover where their money actually goes when they examine it objectively.
        Once you understand your spending patterns, you can establish a realistic budget following the 50/30/20 rule as a general guideline: 50% of after-tax income toward needs, 30% toward wants, and 20% toward savings and debt repayment. These percentages may need adjustment based on your cost of living and financial goals, but they provide a helpful starting point.
        Building an emergency fund is the next critical step. Financial experts recommend saving three to six months of essential expenses in an easily accessible account. This fund provides peace of mind and prevents minor setbacks from becoming financial disasters. Start with a small goal, like $1,000, then gradually build toward the larger target. Even small, consistent deposits add up over time.
        Understanding the difference between good and bad debt is essential for making sound financial decisions. Generally, good debt helps build wealth or increase income over time, such as mortgages (which build equity in an appreciating asset), student loans (which can increase earning potential), or business loans (which may generate income). Bad debt typically finances depreciating assets or consumption, like high-interest credit card balances or payday loans.
        For those carrying high-interest debt, developing a repayment strategy should be a priority. The two most common approaches are the avalanche method (paying off debts in order of highest to lowest interest rate) and the snowball method (paying off smallest balances first). The avalanche method saves more money over time, while the snowball method provides psychological wins that keep many people motivated. Choose the approach that aligns with your personality and circumstances.
        Retirement planning, though often postponed, becomes significantly more challenging the longer you wait. The power of compound interest means that starting small but early can yield much greater results than starting later with larger contributions. If your employer offers a 401(k) match, contribute at least enough to capture this benefit—it's essentially free money. Beyond this, consider Roth or traditional IRAs depending on your tax situation.
        Insurance is an often overlooked aspect of financial planning. Adequate health, auto, home/rental, and disability insurance protects your financial foundation from catastrophic expenses. Life insurance becomes important when others depend on your income. Review coverage annually to ensure it continues to meet your needs as circumstances change.
        Understanding basic investing principles can help grow wealth over time. The key concepts include diversification (spreading investments across various assets to reduce risk), asset allocation (determining the right mix of stocks, bonds, and other investments based on your goals and risk tolerance), and the impact of fees on long-term returns. For most people, low-cost index funds offer an effective way to invest without needing extensive knowledge or time commitment.
        Tax planning shouldn't be limited to a few weeks before filing deadlines. Throughout the year, consider how financial decisions might impact your tax situation. Retirement contributions, health savings accounts, educational savings plans, and certain investment strategies can all provide tax advantages worth exploring. Consult with a tax professional to ensure you're not paying more than necessary.
        Estate planning isn't just for the wealthy. Basic documents like a will, advance healthcare directive, and powers of attorney ensure your wishes are followed and reduce complications for loved ones during difficult times. These documents should be reviewed and updated after major life events like marriage, divorce, births, or significant changes in assets.
        Financial literacy is an ongoing journey rather than a destination. Economic conditions, tax laws, and personal circumstances constantly evolve, requiring periodic reassessment of strategies. Commit to regular financial check-ups, just as you would for physical health, adjusting course as needed to stay aligned with your goals.
        Perhaps most importantly, recognize that financial decisions are deeply personal, reflecting individual values, goals, and circumstances. While general principles apply broadly, the right approach for you depends on your unique situation. Define what financial success means in your own life—whether that's early retirement, homeownership, funding education, supporting causes you care about, or simply achieving stability—and build your financial plan around these priorities.
        By developing financial literacy and applying these fundamental principles consistently, you can transform your relationship with money from one of anxiety or avoidance to one of confidence and control. The journey requires patience and discipline, but the resulting security and options make every effort worthwhile.`,
    "comments": [
      {
        "body": "The 50/30/20 rule has been so helpful for me as a starting point. I had to adjust the percentages for my high-rent city, but the framework still works."
      },
      {
        "body": "Any recommendations for good personal finance books for absolute beginners? I feel so behind on all of this."
      },
      {
        "body": "I wish they taught this stuff in high school. I'm in my 30s and just now figuring all this out."
      }
    ]
  },
  {
    "title": "The Joy of Urban Gardening",
    "published": false,
    "body": `When I moved into my apartment in the city center three years ago, I mourned the loss of garden space. Coming from a suburban home with a modest backyard, I couldn't imagine how I'd continue nurturing plants in a fifth-floor apartment with just a small balcony facing north. What began as a tentative experiment with a few potted herbs has blossomed into a thriving urban garden that brings me daily joy and surprising abundance.
        Urban gardening requires rethinking conventional growing wisdom and getting creative with space. My first step was assessing the light conditions throughout the day. Even with a north-facing balcony, I discovered that the right corner received about four hours of morning sun—enough for many herbs and some vegetables. I installed shelving to maximize vertical space and purchased railing planters that hang on the outside of the balcony, effectively doubling my growing area.
        Container selection proved crucial to success. While aesthetically pleasing ceramic pots complement my decor, they're heavy and expensive. I've found that repurposed plastic containers work wonderfully with proper drainage holes added. Five-gallon buckets grow impressive tomato plants, while salad greens thrive in shallow storage containers. Old dresser drawers lined with landscape fabric make perfect planters for root vegetables like radishes and carrots.
        Soil quality becomes even more important in container gardening than in ground plots. Plants in containers rely entirely on the nutrients and moisture management of their limited soil environment. I create my own container mix using equal parts compost, coconut coir (a sustainable alternative to peat moss), and vermiculite or perlite for drainage. This combination retains moisture while preventing the compaction common in containers.
        Watering presents both challenges and opportunities in urban gardening. Containers dry out faster than ground soil, sometimes requiring twice-daily watering during summer heat. I installed a simple drip irrigation system connected to a timer, ensuring consistent moisture even when work or travel takes me away. Additionally, I collect rainwater in a narrow barrel fitted to my downspout, reducing water consumption and providing the chemical-free water that plants prefer.
        Plant selection requires thoughtful consideration of space constraints and conditions. Dwarf or bush varieties of vegetables offer full-sized harvests in compact forms. Trellises and vertical supports allow vining plants like cucumbers and beans to grow upward rather than outward. Interplanting compatible crops maximizes yield—shallow-rooted lettuces grow happily beneath deeper-rooted peppers, utilizing the same container real estate efficiently.
        One unexpected benefit of urban gardening has been the intensified sensory experience. With plants concentrated in a small area, the fragrance of herbs and flowers becomes more noticeable. The sound of bees visiting my small patch of lavender provides a soothing background to morning coffee. Watching butterflies discover my milkweed plants on a fifth-floor balcony feels like witnessing a small miracle of urban ecology.
        The harvests, though modest compared to traditional gardens, provide remarkable satisfaction. There's nothing quite like stepping outside to snip fresh herbs while cooking or harvesting a perfectly ripe cherry tomato as an immediate snack. Last summer, my six compact containers produced enough vegetables to make a significant difference in my grocery shopping throughout the growing season.
        Winter presents particular challenges, but extending the growing season becomes a rewarding puzzle. Cold frames fashioned from repurposed window panes protect cool-weather crops like kale and spinach well into December. Moving some containers indoors near south-facing windows allows for year-round herbs. Under grow lights, I start seedlings in late winter, getting a head start on the next growing season while snow still falls outside.
        Perhaps most valuable has been the community that has grown alongside my plants. Neighbors who previously exchanged nothing more than polite nods now stop to discuss gardening techniques and exchange cuttings. I've connected with local urban gardening groups that organize seed swaps and container gardening workshops. These relationships enrich my life far beyond the produce harvested.
        My balcony garden has taught me patience and observation in new ways. When growing space is limited, each plant receives more individual attention. I notice subtle changes in leaf color or structure that might indicate nutrient needs. The constraint of space leads to more thoughtful decisions about what to grow, prioritizing plants that bring particular joy or flavors unavailable in stores.
        For those hesitant to begin due to limited space or gardening experience, start with just a few herbs in a sunny window. Basil, mint, and chives grow easily and immediately enhance your cooking. As confidence builds, expand gradually, learning from both successes and inevitable failures. Gardening teaches resilience—plants often recover from mistakes more readily than we expect.
        Urban gardening challenges the assumption that meaningful connection with nature requires rural settings or substantial outdoor space. My small balcony has become an oasis of growth and seasonal change, a daily reminder of natural cycles even amid concrete and glass. This patch of green offers environmental benefits through increased urban`,
    "comments": [
        {
          "body": "Your vertical gardening setup sounds amazing! I've been hesitant to try gardening on my balcony because of limited space, but you've inspired me to give it a shot this spring."
        },
        {
          "body": "Do you have any tips for north-facing balconies that get very little direct sunlight? I'm struggling to find plants that will thrive in my shady situation."
        },
        {
          "body": "I love the idea of repurposing containers! I've been using old yogurt containers for seedlings but never thought about dresser drawers for root vegetables. Brilliant!"
        },
        {
          "body": "The community aspect resonates with me so much. I started growing herbs on my windowsill and suddenly my neighbors were stopping by to chat gardening. It's created connections I never expected."
        },
        {
          "body": "How do you deal with pests in a balcony garden? I tried growing tomatoes last year and they got completely destroyed by aphids."
        }
    ]
  },
  {
    "title": "My Journey Through The Odin Project: What I've Learned So Far",
    "published": true,
    "body": `When I first decided to learn web development, the sheer volume of resources available online was overwhelming. After researching various learning paths, I settled on The Odin Project—a free, open-source curriculum that has completely transformed my understanding of web development fundamentals.
    The journey began with the Foundations course, which provided a comprehensive introduction to HTML, CSS, and basic JavaScript. Unlike other platforms that simply explain concepts, The Odin Project emphasizes learning by doing. Each module concludes with practical projects that reinforce theoretical knowledge—from creating a simple recipe website to building interactive rock-paper-scissors games.
    What sets The Odin Project apart is its focus on developer tools and workflows. Early in the curriculum, I learned to use Git for version control, which has been invaluable for tracking my progress and experimenting with new features. The GitHub integration encouraged me to build a portfolio of projects right from the start, documenting my growth as a developer.
    The JavaScript path was particularly enlightening. Instead of just teaching syntax, it delves into core programming concepts like recursion, factory functions, and module patterns. The curriculum's emphasis on understanding these fundamentals rather than framework-specific knowledge has given me the confidence to approach new technologies independently.
    One of my biggest breakthroughs came during the Full Stack JavaScript section. Building a complete application—from designing the backend with Node.js and Express to creating responsive frontends with React—helped me understand how all the pieces fit together. The project-based approach forced me to deal with real-world problems like data validation, authentication, and responsive design.
    The Odin Project's community has been equally valuable. The Discord server is filled with like-minded learners at various stages, always ready to provide feedback or help troubleshoot issues. Code reviews from peers have improved my coding practices significantly, teaching me to write cleaner, more maintainable code.
    Perhaps most importantly, The Odin Project taught me to be comfortable with discomfort. The curriculum doesn't hold your hand; instead, it points you in the right direction and challenges you to find solutions independently. This approach mirrors real-world development scenarios and has built my problem-solving muscles.
    Looking back at my GitHub commits over the past months, I can clearly see how far I've come. From struggling with basic DOM manipulation to confidently building full-stack applications, the progression has been remarkable. The projects in my repository now showcase a range of skills: responsive design principles, API integration, database management, and modern JavaScript practices.
    For anyone considering The Odin Project, my advice is simple: trust the process. There will be moments of frustration when concepts don't click immediately, but perseverance pays off. The curriculum is designed to build cumulative knowledge, with each project leveraging skills from previous modules.
    As I continue on this learning journey, I'm excited to further refine my skills and tackle more complex projects. The foundation that The Odin Project has provided is solid, and I'm confident in my ability to grow as a developer from here. The open-source nature of web development means there's always more to learn, but now I have the tools and mindset to embrace that continuous learning process.`,
    "comments": [
      {
        "body": "I've been considering The Odin Project for a while now. Your experience makes it sound worth the effort! How long did it take you to get through the Foundations course?"
      },
      {
        "body": "The project-based approach you described sounds so much better than the tutorial hell I've been stuck in. Did you find the Git workflow difficult to learn at first?"
      },
      {
        "body": "I'm currently working through the JavaScript section and feeling a bit overwhelmed by the concepts. Any tips for getting through the challenging parts?"
      },
      {
        "body": "Your GitHub repository is impressive! I can really see the progression in your projects. Which one was your favorite to build?"
      }
    ]
  },
  {
    "title": "5 Web Development Tools That Changed My Workflow",
    "published": true,
    "body": `Over the past year of learning web development, I've experimented with dozens of tools and extensions that promise to boost productivity. While many were helpful, a select few have fundamentally transformed how I write code. Here are five tools that have become essential parts of my daily development workflow.
    First on my list is VS Code, which has become my editor of choice after trying several alternatives. Beyond its clean interface and exceptional performance, the real power comes from its extension ecosystem. The ability to customize the editor to suit specific projects or languages makes it infinitely adaptable. Extensions like ESLint and Prettier help maintain code quality by automatically enforcing style guidelines and catching potential bugs before they make it into production. Live Server is another game-changer, providing instant visual feedback as I modify HTML and CSS.
    Git and GitHub might seem obvious inclusions, but their impact cannot be overstated. Version control was intimidating at first, especially concepts like branching and merging. However, once these practices became habit, they completely changed how I approach projects. The ability to experiment freely in separate branches without fear of breaking working code has encouraged me to take more risks and try new approaches. GitHub's Pull Request workflow has also taught me to review my own code more critically before considering it complete.
    Chrome DevTools deserves a special mention for transforming how I debug and optimize websites. The ability to inspect elements, modify styles in real-time, and test responsiveness across different device sizes has been invaluable. The Network and Performance tabs have been particularly eye-opening, helping me understand how loading optimizations impact user experience. The Console has become my first stop when tracking down JavaScript issues, with breakpoints saving countless hours of debugging time.
    Figma has revolutionized my approach to design implementation. Before discovering this tool, I would often jump straight into coding without a clear visual direction. Now, I spend time creating wireframes and mockups in Figma, which serves as a visual contract for what I'm building. The ability to extract CSS values, export assets, and check precise measurements has significantly reduced the back-and-forth between design and implementation phases. The collaborative features also make it easy to get feedback from others before writing a single line of code.
    Finally, Postman has been essential for working with APIs. As my projects grew more complex and started incorporating third-party services, I needed a reliable way to test endpoints and understand response structures. Postman's intuitive interface makes it easy to send requests with different parameters and authentication methods. The ability to save collections of requests has been particularly useful for testing my own backend APIs during development, ensuring they behave as expected before connecting them to the frontend.
    These tools share a common thread: they all provide immediate feedback that shortens the development cycle. Rather than writing large chunks of code and then testing, I can now work in smaller, more manageable increments with constant validation. This approach has not only improved the quality of my code but has also made the development process more enjoyable.
    The learning curves varied—Git commands and DevTools took the longest to master, while VS Code and Figma offered immediate value. However, the investment in learning these tools has paid dividends in productivity and code quality. Each has become an extension of my development thinking, allowing me to focus more on solving problems rather than fighting with implementation details.
    As my skills continue to evolve, I'm sure my toolkit will adapt as well. I'm particularly interested in exploring containerization with Docker and automated testing frameworks in the near future. The web development ecosystem is constantly changing, and staying curious about new tools is essential for growth as a developer. What tools have transformed your workflow? I'd love to hear about your experiences in the comments below.`,
    "comments": [
      {
        "body": "Great recommendations! I'd add Notion to this list - it's been amazing for keeping all my development notes and resources organized in one place."
      },
      {
        "body": "I've been avoiding learning Git properly for too long. Your description of how it changed your approach to projects is motivating me to finally dive in properly."
      },
      {
        "body": "Have you tried GitHub Copilot yet? It's been a game changer for me, especially when writing boilerplate code."
      }
    ]
  },
  {
    "title": "Responsive Design: Beyond Media Queries",
    "published": true,
    "body": `When I first learned about responsive web design, media queries seemed like a magical solution. By adding a few CSS rules, websites could transform to fit any screen size. While media queries remain an essential tool, my recent projects have taught me that truly responsive design requires a more comprehensive approach—one that considers content flexibility, performance, and user experience across all devices.
    The shift toward mobile-first design has been a fundamental change in my approach. Rather than building for desktop and then squeezing that experience into smaller screens, I now start with the mobile layout and progressively enhance it for larger displays. This approach forces me to prioritize content and functionality from the beginning, resulting in more focused experiences across all devices.
    CSS Grid and Flexbox have revolutionized how I structure layouts. These modern layout systems allow for intrinsically responsive designs that adapt to available space without relying exclusively on media queries. Using Grid's minmax() function and Flexbox's flex-grow/shrink properties, elements can fluidly resize within constraints. This technique reduces the number of breakpoints needed and creates more natural transitions between different screen sizes.
    Responsive typography has been another game-changer in my workflow. Using relative units like em, rem, and viewport units instead of fixed pixel values ensures that text scales appropriately across devices. The clamp() function has been particularly useful, allowing me to set minimum and maximum font sizes while maintaining fluid scaling between them. This approach eliminates many media queries that would otherwise be needed just for text adjustments.
    The concept of responsive images deserves special attention, as images often account for the majority of a page's weight. The srcset and sizes attributes allow browsers to download the most appropriate image size based on the device's screen and resolution. Coupled with modern formats like WebP and AVIF, this approach significantly improves loading times on mobile devices with limited bandwidth.
    Beyond these technical considerations, I've learned that responsive design is also about adapting the user experience to different contexts. Touch interactions require larger hit areas than mouse clicks, and certain features might be more important on mobile than desktop (or vice versa). Sometimes this means creating fundamentally different interfaces for different devices, not just resized versions of the same layout.
    Performance considerations are inseparable from responsive design. Mobile users often face constraints in processing power and network speed, making optimizations crucial. Techniques like lazy loading, code splitting, and selective loading of resources based on device capabilities have become standard parts of my development process.
    Testing remains one of the most challenging aspects of responsive design. The diversity of devices and browsers means that what works perfectly on one device might fail on another. I've developed a testing workflow that combines browser developer tools for initial testing, real device testing for critical paths, and automated testing for catching regression issues across breakpoints.
    Accessibility considerations must also be integrated into responsive approaches. Features like pinch-to-zoom should never be disabled, and touch targets need to be large enough for users with motor impairments. Text spacing and line length must be carefully controlled to maintain readability across screen sizes.
    As web capabilities continue to evolve, responsive design extends beyond visual layout to include responsive behavior. The matchMedia JavaScript API allows functionality to adapt to the same media queries that control layout, creating cohesive experiences where both appearance and behavior respond appropriately to the user's device.
    The future of responsive design looks exciting, with container queries on the horizon promising even more granular control. Unlike media queries that check the viewport size, container queries will respond to the size of a specific container element, enabling truly modular components that adapt to their context rather than the overall screen size.
    The journey from basic media queries to comprehensive responsive strategies hasn't been straightforward, but it has dramatically improved the quality and inclusivity of my projects. By embracing flexibility at every level—from layout and typography to images and functionality—we can create web experiences that truly work for everyone, regardless of their device or context.`,
    "comments": [
      {
        "body": "This is so timely! I've been struggling with making my navigation truly responsive without resorting to completely different code for mobile. The CSS Grid tip was helpful."
      },
      {
        "body": "Could you share some specific examples of how you use clamp() for responsive typography? I'm still trying to wrap my head around the right values to use."
      },
      {
        "body": "What testing tools do you recommend for checking responsive designs across different devices? It's become the most time-consuming part of my workflow."
      },
      {
        "body": "I've been hearing about container queries for what feels like forever! Any idea when they'll be widely supported enough to use in production?"
      },
      {
        "body": "The point about responsive behavior vs. just responsive layout is spot on. I think many developers (myself included) focus too much on how things look and not enough on how they work across devices."
      }
    ]
  },
  {
    "title": "Embracing the Pomodoro Technique for Productivity",
    "published": true,
    "body": `Balancing coding sessions with rest can be challenging, especially when immersed in complex problems. During my journey through The Odin Project curriculum, I often found myself coding for hours without breaks, only to end up mentally exhausted with diminishing returns. That's when I discovered the Pomodoro Technique—a simple time management method that has completely transformed my productivity and learning efficiency.
    The method is straightforward: work for 25 minutes, then take a 5-minute break. After four cycles, take a longer break of 15-30 minutes. This approach helps maintain focus during work sessions and prevents burnout through regular intervals of rest. The beauty of the technique lies in its simplicity and the psychological principles behind it.
    When I first implemented this technique during my Odin Project studies, I was skeptical about whether structured breaks would actually improve my output. To my surprise, I found that having a defined work period created a sense of urgency that helped me avoid distractions. Knowing that I only had 25 minutes to make progress motivated me to stay focused on the task at hand rather than bouncing between browser tabs or checking social media.
    I used dedicated timer applications to structure my sessions, ensuring I dedicated focused time to learning concepts and developing projects. Apps like Pomofocus and TomatoTimer offer customizable timers specifically designed for this method, with visual and audio cues that signal transitions between work and break periods. For those who prefer physical reminders, a simple kitchen timer works just as well—the original inventor Francesco Cirillo actually named the technique after his tomato-shaped kitchen timer.
    The regular breaks proved to be just as valuable as the focused work intervals. Instead of viewing breaks as lost productivity, I came to understand them as essential components of sustainable work habits. During my 5-minute breaks, I would step away from the screen, stretch, grab water, or simply look out the window. These brief mental resets allowed me to return to tasks with renewed energy and often a fresh perspective on problems I was tackling.
    What I found particularly interesting was how the technique changed my relationship with difficult coding challenges. Before adopting Pomodoro, I would sometimes spend hours stuck on a single problem, growing increasingly frustrated and less effective. With timed intervals, I gave myself permission to put challenging problems aside after a Pomodoro session if I hadn't made progress. Often, solutions would come to me during breaks or in the next work session when looking at the code with fresh eyes.
    Integrating this technique with task management tools took my productivity to another level. I began breaking down larger projects into discrete tasks that could fit within one or several Pomodoro sessions. Using Trello boards or simple to-do lists, I would estimate the number of Pomodoros each task might require, then track my actual time spent. This practice helped tremendously in organizing and prioritizing my workload, especially when juggling multiple aspects of a project or course modules with different deadlines.
    As an unexpected benefit, the Pomodoro Technique significantly improved my time estimation skills—something notoriously difficult for developers at all levels. By tracking the number of Pomodoros needed for different types of tasks, I gained better insight into my working patterns and became more accurate in planning my schedule. This improved estimation ability reduced my stress levels about deadlines and helped me create more realistic project timelines.
    The technique also provided valuable data about my productivity patterns. I noticed that I typically had higher focus and creative energy in the morning, making this the optimal time to tackle complex JavaScript algorithms or learn new concepts. Afternoons were better suited for design work or debugging tasks. By aligning my Pomodoro sessions with these natural energy rhythms, I further optimized my learning efficiency.
    Of course, the technique isn't without challenges. Some days, getting started is the hardest part, and the prospect of a 25-minute commitment feels daunting. On those days, I use a modified approach called 'Just Five Minutes'—committing to work for just five minutes, knowing I can stop after that if I want to. Invariably, once I've started, momentum builds and continuing for the full Pomodoro becomes much easier.
    Another challenge comes with deep work states—sometimes I'd hit a flow state right as my timer went off. While purists might insist on taking the break anyway, I've found that flexibility serves me better. If I'm in a productive flow, I might extend the session by another 10-15 minutes before taking a slightly longer break afterward. The key is maintaining awareness of diminishing returns and not pushing so long that quality suffers.
    For collaborative work, I've found that syncing Pomodoro schedules with team members or study partners creates a supportive structure. During paired programming sessions for Odin Project exercises, having synchronized work and break periods kept everyone refreshed and engaged. It also provided natural intervals for discussing progress and next steps.
    Incorporating the Pomodoro Technique into your routine can lead to more structured and productive work sessions. Whether you're learning to code, working on side projects, or managing professional development, this method provides a framework that acknowledges both our need for focused work and our natural cognitive limitations. It's a simple yet effective strategy to maintain consistent progress in your learning journey while avoiding the burnout that often comes with intensive skill acquisition.
    As with any productivity method, the key is adapting it to your personal needs rather than following it rigidly. Experiment with different work/break intervals, tracking methods, and complementary tools to find the version that works best for your specific circumstances and projects. The ultimate goal isn't perfect adherence to a system but creating sustainable work habits that support both your productivity and wellbeing in the long term.`,
    "comments": [
      {
        "body": "I've tried the Pomodoro Technique before but struggled with the transitions between sessions. Do you have any tips for getting back into focus mode after a break?"
      },
      {
        "body": "This is exactly what I needed to read! I've been coding for 6+ hours straight and wondering why my productivity tanks. Going to try implementing this tomorrow with the Forest app."
      },
      {
        "body": "Have you found any particular activities that are best for the 5-minute breaks? I tend to check my phone which often turns into much longer distractions."
      },
      {
        "body": "Do you still use this technique now that you're working on more complex projects? I find 25 minutes sometimes isn't enough to get into deeper problem-solving tasks."
      },
      {
        "body": "I've heard of the Pomodoro Technique but never tried it. This article convinced me to give it a shot!"
      },
      {
        "body": "Do you use any specific apps or tools to track your Pomodoro sessions?"
      },
      {
        "body": "Great tips! I've been struggling with staying focused during long coding sessions—this might help."
      }
    ]
  }, 
  {
    "title": "Short title for testing",
    "published": false,
    "body": `Lorem ipsum dolor sit amet, consectetur`,
    "comments": []
  }
]


async function seedPostsAndComments(blogPosts, authors, users) {
    try {
      console.log(`Starting to seed ${blogPosts.length} posts and their comments...`);
      
      for (let i = 0; i < blogPosts.length; i++) {
        const post = blogPosts[i];
        
        // Assign a random author from the authors array
        const authorId = authors[Math.floor(Math.random() * authors.length)];
        
        // Generate random post date
        const postDate = generateRandomDate();
        
        // Create the post
        const createdPost = await prisma.blogPost.create({
          data: {
            title: post.title,
            body: post.body,
            published: post.published,
            authorId: authorId,
            createdAt: postDate
          }
        });
        
        // console.log(`Created post: ${post.title}`);
        
        // Create comments for this post if they exist
        if (post.comments && post.comments.length > 0) {
          for (const comment of post.comments) {
            // Assign random user (could be any user) as comment author
            const commentAuthorId = users[Math.floor(Math.random() * users.length)];
            
            // Generate random comment date after post date
            const commentDate = generateRandomCommentDate(postDate);
            
            // Create comment
            await prisma.blogComment.create({
              data: {
                body: comment.body,
                authorId: commentAuthorId,
                postId: createdPost.id,
                createdAt: commentDate
              }
            });
          }
          // console.log(`Added ${post.comments.length} comments to post: ${post.title}`);
        }
      }
      
      console.log('Posts and comments seeding completed successfully 🌱');
    } catch (error) {
      console.error('Error seeding posts and comments:', error);
      throw error;
    }
}

export { seedPostsAndComments, blogPosts }