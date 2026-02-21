import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    // First, get the first user in the DB to use as the post owner
    const user = await prisma.user.findFirst();

    if (!user) {
        console.error("❌ No users found in DB. Please register a user first!");
        process.exit(1);
    }

    console.log(`✅ Using user: ${user.username} (${user.id})`);

    const posts = [
        {
            title: "A Great Apartment Next to the Beach!",
            images: [
                "https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            ],
            bedroom: 2,
            bathroom: 1,
            price: 1000,
            address: "456 Park Avenue, London",
            city: "London",
            latitude: "51.5074",
            longitude: "-0.1278",
            type: "rent",
            property: "apartment",
        },
        {
            title: "An Awesome Apartment Near the Park!",
            images: [
                "https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            ],
            bedroom: 3,
            bathroom: 2,
            price: 1500,
            address: "789 Oxford Street, London",
            city: "London",
            latitude: "52.4862",
            longitude: "-1.8904",
            type: "buy",
            property: "apartment",
        },
        {
            title: "A New Apartment in the City!",
            images: [
                "https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            ],
            bedroom: 1,
            bathroom: 1,
            price: 800,
            address: "101 Baker Street, London",
            city: "London",
            latitude: "53.4808",
            longitude: "-2.2426",
            type: "rent",
            property: "apartment",
        },
        {
            title: "Great Location! Great Price! Great Apartment!",
            images: [
                "https://images.pexels.com/photos/2467285/pexels-photo-2467285.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            ],
            bedroom: 2,
            bathroom: 1,
            price: 1000,
            address: "234 Kingsway, London",
            city: "London",
            latitude: "53.8008",
            longitude: "-1.5491",
            type: "buy",
            property: "house",
        },
        {
            title: "Luxury Apartment with Stunning Views",
            images: [
                "https://images.pexels.com/photos/276625/pexels-photo-276625.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            ],
            bedroom: 3,
            bathroom: 2,
            price: 1500,
            address: "567 Victoria Road, London",
            city: "London",
            latitude: "53.4084",
            longitude: "-2.9916",
            type: "rent",
            property: "condo",
        },
        {
            title: "Cozy Studio in Regent Street",
            images: [
                "https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            ],
            bedroom: 1,
            bathroom: 1,
            price: 800,
            address: "890 Regent Street, London",
            city: "London",
            latitude: "54.9783",
            longitude: "-1.6174",
            type: "rent",
            property: "apartment",
        },
        {
            title: "Modern Flat in Piccadilly",
            images: [
                "https://images.pexels.com/photos/2029667/pexels-photo-2029667.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            ],
            bedroom: 2,
            bathroom: 1,
            price: 1000,
            address: "112 Piccadilly, London",
            city: "London",
            latitude: "53.3811",
            longitude: "-1.4701",
            type: "buy",
            property: "apartment",
        },
        {
            title: "Spacious Family Home on High Street",
            images: [
                "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            ],
            bedroom: 3,
            bathroom: 2,
            price: 1500,
            address: "8765 Main High Street, London",
            city: "London",
            latitude: "51.4545",
            longitude: "-2.5879",
            type: "buy",
            property: "house",
        },
    ];

    console.log(`\n🌱 Seeding ${posts.length} posts...\n`);

    for (const post of posts) {
        const created = await prisma.post.create({
            data: {
                ...post,
                userId: user.id,
                postDetail: {
                    create: {
                        desc: `Beautiful property located at ${post.address}. Features ${post.bedroom} bedroom(s) and ${post.bathroom} bathroom(s). A wonderful place to call home!`,
                        size: Math.floor(Math.random() * 500) + 500,
                        school: Math.floor(Math.random() * 5),
                        bus: Math.floor(Math.random() * 5),
                        restaurant: Math.floor(Math.random() * 10),
                    },
                },
            },
        });
        console.log(`  ✅ Created: "${created.title}"`);
    }

    console.log("\n🎉 Seeding complete!");
}

main()
    .catch((e) => {
        console.error("❌ Seeding failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
