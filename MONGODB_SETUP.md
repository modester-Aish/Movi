# MongoDB Setup Guide for CineVerse

## Overview
This guide will help you set up MongoDB for the CineVerse movie application. The application now uses MongoDB to store and manage movie data instead of static files, allowing for better scalability and dynamic content management.

## Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

## Step 1: Install Dependencies

```bash
npm install
```

This will install all required dependencies including:
- `mongodb`: MongoDB driver
- `mongoose`: MongoDB ODM
- `dotenv`: Environment variable management

## Step 2: MongoDB Setup

### Option A: Local MongoDB Installation

1. **Install MongoDB Community Edition:**
   - Windows: Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - macOS: `brew install mongodb-community`
   - Linux: Follow [MongoDB Installation Guide](https://docs.mongodb.com/manual/installation/)

2. **Start MongoDB Service:**
   ```bash
   # Windows (as Administrator)
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

3. **Verify MongoDB is running:**
   ```bash
   mongosh
   # or
   mongo
   ```

### Option B: MongoDB Atlas (Cloud)

1. **Create MongoDB Atlas Account:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account
   - Create a new cluster

2. **Get Connection String:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

## Step 3: Environment Configuration

1. **Update `.env.local` file:**
   ```env
   # For Local MongoDB
   MONGODB_URI=mongodb://localhost:27017/movies_db
   
   # For MongoDB Atlas
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/movies_db
   
   # TMDB API Key (if you have one)
   TMDB_API_KEY=your_tmdb_api_key_here
   ```

2. **Replace placeholders:**
   - For local MongoDB: Use the default URI
   - For Atlas: Replace `username`, `password`, and `cluster` with your actual values

## Step 4: Import Sample Data

The application includes a script to import sample movie data:

```bash
node scripts/import-sample-movies.js
```

This script will:
- Connect to your MongoDB database
- Import 30+ sample movies across all categories
- Use bulk operations for efficient data insertion
- Handle duplicates with upsert operations

## Step 5: Database Structure

### Collections
- **movies**: Main collection storing movie information

### Movie Schema
```javascript
{
  imdbId: String (unique, indexed),
  title: String (required, indexed),
  year: Number (indexed),
  category: String (required, enum values),
  genre: String (indexed),
  rating: Number (0-10),
  poster: String,
  backdrop: String,
  overview: String,
  runtime: Number,
  language: String,
  status: String,
  budget: Number,
  revenue: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Categories
- **Homepage Categories**: FEATURED, TRENDING, NEW_RELEASES, TOP_RATED
- **Genre Categories**: ACTION, DRAMA, COMEDY, THRILLER, HORROR, ROMANCE, SCI_FI, ANIMATION, DOCUMENTARY, FAMILY

## Step 6: Running the Application

```bash
npm run dev
```

The application will now:
- Connect to MongoDB on startup
- Fetch movies from the database instead of static files
- Display movie counts from the database
- Support dynamic category filtering

## Step 7: Adding Your 90K Movies

### Method 1: Using the Bulk Import API

Create a JSON file with your movie data and use the bulk import endpoint:

```bash
curl -X POST http://localhost:3000/api/movies/bulk \
  -H "Content-Type: application/json" \
  -d @your-movies.json
```

### Method 2: Database Direct Import

Use MongoDB Compass or mongosh to import your data:

```bash
mongoimport --db movies_db --collection movies --file your-movies.json --jsonArray
```

### Method 3: Custom Import Script

Create a custom script similar to `scripts/import-sample-movies.js` for your specific data format.

## API Endpoints

### Get Movies by Category
```
GET /api/movies?category=FEATURED&limit=20&page=1
```

### Search Movies
```
GET /api/movies/search?q=inception&category=SCI_FI&limit=20
```

### Bulk Import
```
POST /api/movies/bulk
Content-Type: application/json

{
  "movies": [
    {
      "imdbId": "tt0111161",
      "title": "The Shawshank Redemption",
      "year": 1994,
      "category": "FEATURED",
      "genre": "Drama",
      "rating": 9.3,
      // ... other fields
    }
  ]
}
```

## Performance Optimization

### Indexes
The application automatically creates indexes for:
- `imdbId` (unique)
- `title` (text search)
- `category` (filtering)
- `rating` (sorting)
- `year` (sorting)
- Compound indexes for efficient queries

### Caching
- Client-side caching for category data
- MongoDB connection pooling
- Efficient bulk operations for data import

## Troubleshooting

### Connection Issues
1. **Check MongoDB is running:**
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl status mongod
   ```

2. **Verify connection string:**
   - Test with mongosh: `mongosh "your-connection-string"`
   - Check for typos in username/password

3. **Network issues (Atlas):**
   - Whitelist your IP address in Atlas
   - Check firewall settings

### Data Import Issues
1. **Check data format:**
   - Ensure all required fields are present
   - Validate enum values for categories

2. **Memory issues with large imports:**
   - Use smaller batch sizes
   - Increase Node.js memory limit: `node --max-old-space-size=4096`

### Application Errors
1. **Check environment variables:**
   - Ensure `.env.local` exists
   - Verify `MONGODB_URI` is set correctly

2. **Database permissions:**
   - Ensure user has read/write permissions
   - Check collection access rights

## Scaling Considerations

### For Large Datasets (90K+ movies)
1. **Use pagination:** Always use `limit` and `page` parameters
2. **Implement caching:** Consider Redis for frequently accessed data
3. **Optimize queries:** Use specific indexes for your query patterns
4. **Sharding:** Consider MongoDB sharding for very large datasets

### Performance Monitoring
1. **MongoDB Atlas:** Use built-in monitoring tools
2. **Local MongoDB:** Use `mongotop` and `mongostat`
3. **Application:** Monitor query performance and response times

## Security Best Practices

1. **Environment Variables:** Never commit `.env.local` to version control
2. **Database Access:** Use least privilege principle for database users
3. **Input Validation:** Validate all user inputs before database operations
4. **Connection Security:** Use SSL/TLS for production connections

## Support

If you encounter issues:
1. Check the MongoDB logs
2. Verify your connection string
3. Test with a simple MongoDB client
4. Review the application logs for detailed error messages

## Next Steps

After setup, you can:
1. Import your 90K movie dataset
2. Customize categories and genres
3. Add more API endpoints as needed
4. Implement advanced search features
5. Add user authentication and favorites
