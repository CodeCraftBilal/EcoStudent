# EcoStudent Hybrid Recommendation System

## 🧠 Algorithms Used

The recommendation system utilizes a **Hybrid Filtering Approach**, combining multiple techniques to provide robust suggestions while mitigating common issues like cold starts.

### 1. Content-Based Filtering
- **Technique**: Term Frequency-Inverse Document Frequency (TF-IDF) & Cosine Similarity.
- **How it works**: It processes textual data (`title`, `description`, `producttype`) to understand what the item is about. By converting the text into TF-IDF vectors, the algorithm finds other items mathematically similar (using Cosine Similarity) to the products the user has already interacted with.

### 2. Collaborative Filtering
- **Technique**: Item-Item Collaborative Filtering (Cosine Similarity).
- **How it works**: Instead of looking at user similarity (which can be sparse), it looks at item relationships based on user interactions (purchases, favorites, reviews). If users frequently interact with Item A and Item B together, then Item B will be recommended to a new user who interacts with Item A.

### 3. Location-Based Filtering
- **Technique**: Haversine Formula for distance calculation.
- **How it works**: It determines the shortest geographical distance between the user's coordinates and the seller's coordinates. Products are scored higher if they are closer (e.g., within 10 km) to prioritize local exchanges.

### 4. Popularity-Based Ranking
- **Technique**: Min-Max Scaling on engagement metrics.
- **How it works**: Ranks products globally based on their `views` and `viewcount`. This helps solve the cold-start problem for new users who don't have enough history to get personalized recommendations.

### 5. The Hybrid Combiner
- A weighted scoring system normalizes the scores from the 4 models and combines them:
  `Final Score = 0.3 * Content + 0.3 * Collaborative + 0.2 * Location + 0.2 * Popularity`
- It generates natural language explanations (e.g., "Nearby and Popular right now") to increase transparency and user trust.

---

## 🚀 Integration with NestJS

To consume this FastAPI microservice from your NestJS backend, you need to create a service that communicates via HTTP.

### Step 1: Install Axios / Http Module in NestJS
If you haven't already, install the necessary package:
```bash
npm i @nestjs/axios
```

### Step 2: Implement a Recommendation Service
In your NestJS app (`apps/backend/src/recommendation/recommendation.service.ts`):

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class RecommendationService {
  private readonly logger = new Logger(RecommendationService.name);
  // URL where your FastAPI service is running
  private readonly aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';

  constructor(private readonly httpService: HttpService) {}

  async getRecommendations(userId: number, limit: number = 10) {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.aiServiceUrl}/recommendations/${userId}?limit=${limit}`)
      );
      
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to fetch recommendations for user ${userId}`, error);
      // Fallback: Return popularity-based or latest products from DB directly
      return null;
    }
  }

  async triggerModelRefresh() {
    try {
      await lastValueFrom(this.httpService.post(`${this.aiServiceUrl}/recommendations/refresh`));
      return { success: true };
    } catch (error) {
      this.logger.error('Failed to trigger AI model refresh', error);
      return { success: false };
    }
  }
}
```

### Step 3: Trigger Model Refreshes
Machine learning models (similarity matrices) should not be refreshed on every request. The FastAPI service has a `/recommendations/refresh` endpoint.
You can use NestJS `@Cron` scheduler to trigger this every night, or trigger it via a webhook when a new product is listed.

```typescript
import { Cron, CronExpression } from '@nestjs/schedule';

export class RecommendationCronTasks {
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleModelRefresh() {
    await this.recommendationService.triggerModelRefresh();
  }
}
```
