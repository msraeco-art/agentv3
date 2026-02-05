# Agent V3 - Multi-Agent AI System

A sophisticated multi-agent AI system that breaks down complex tasks into steps and executes them using specialized agents with memory and long-term recall capabilities.

## Features

- **Intelligent Planning**: Automatically breaks down user requests into executable steps
- **Specialized Agents**: Multiple agents for different tasks (research, coding, file operations, execution)
- **Memory System**: Short-term memory using PostgreSQL for conversation history
- **Long-term Recall**: Vector-based semantic search for retrieving relevant past interactions
- **Workspace Support**: Isolated workspaces for different projects or contexts
- **Web Dashboard**: Simple web interface for interacting with agents

## Architecture

### Agents

- **Planner Agent**: Analyzes user requests and creates execution plans
- **Researcher Agent**: Performs web searches to gather information
- **Coder Agent**: Generates production-ready code
- **File Agent**: Handles file read/write operations in workspace
- **Executor Agent**: Executes planned tasks

### Components

- **Memory Module**: PostgreSQL-based conversation storage
- **Vector Store**: Embedding-based semantic search for long-term memory
- **Web Tools**: DuckDuckGo integration for research capabilities

## Prerequisites

- **Node.js** >= 18.0.0
- **PostgreSQL** database (local or cloud-hosted)
- **OpenAI API Key** (for GPT-4 and embeddings)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/msraeco-art/agentv3.git
   cd agentv3
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your credentials:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   DATABASE_URL=postgresql://username:password@host:port/database_name
   ```

4. **Set up PostgreSQL database**
   
   The application will automatically create the required tables on first run.
   
   **Option A: Local PostgreSQL**
   ```bash
   # Install PostgreSQL locally
   # macOS: brew install postgresql
   # Ubuntu: sudo apt-get install postgresql
   
   # Create database
   createdb agentv3
   
   # Set DATABASE_URL
   DATABASE_URL=postgresql://localhost:5432/agentv3
   ```
   
   **Option B: Cloud PostgreSQL** (Recommended for deployment)
   - [Supabase](https://supabase.com/) (Free tier available)
   - [Neon](https://neon.tech/) (Serverless PostgreSQL)
   - [Railway](https://railway.app/) (Includes database + hosting)
   - [ElephantSQL](https://www.elephantsql.com/) (Free tier available)

## Usage

### Start the Server

```bash
npm start
```

The API server will start on `http://localhost:3001`

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Using the Dashboard

1. Open `dashboard/index.html` in your browser
2. Enter a workspace name (default: "default")
3. Type your request in the text area
4. Click "Run Agent" to execute

### API Endpoint

**POST** `/agent`

Request body:
```json
{
  "userMessage": "Research the latest AI trends and write a summary",
  "workspace": "default"
}
```

Response:
```json
{
  "role": "assistant",
  "content": "[Research]\n...\n[Code]\n..."
}
```

## Example Requests

- "Research the latest developments in quantum computing"
- "Write a Python function to calculate fibonacci numbers"
- "Create a file called notes.txt with today's tasks"
- "Search for best practices in API design and summarize them"

## Deployment

### Railway (Recommended)

1. Create account at [Railway.app](https://railway.app/)
2. Install Railway CLI: `npm install -g @railway/cli`
3. Login: `railway login`
4. Initialize: `railway init`
5. Add PostgreSQL: `railway add postgresql`
6. Deploy: `railway up`
7. Set environment variables in Railway dashboard

### Render

1. Create account at [Render.com](https://render.com/)
2. Create new Web Service
3. Connect your GitHub repository
4. Add PostgreSQL database
5. Set environment variables
6. Deploy

### Fly.io

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login
flyctl auth login

# Launch app
flyctl launch

# Add PostgreSQL
flyctl postgres create

# Deploy
flyctl deploy
```

## Project Structure

```
agentv3/
├── backend/
│   ├── agents/           # Specialized AI agents
│   │   ├── planner.js    # Task planning agent
│   │   ├── researcher.js # Web research agent
│   │   ├── coder.js      # Code generation agent
│   │   ├── fileAgent.js  # File operations agent
│   │   └── executor.js   # Task execution agent
│   ├── tools/
│   │   └── web.js        # Web search tools
│   ├── vector/
│   │   └── store.js      # Vector embeddings store
│   ├── index.js          # Main server entry point
│   └── memory.js         # PostgreSQL memory module
├── dashboard/
│   └── index.html        # Web dashboard UI
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore rules
├── package.json          # Dependencies and scripts
└── README.md             # This file
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | Yes |
| `DATABASE_URL` | PostgreSQL connection string | Yes |

## Limitations & Known Issues

- **Vector Store**: Currently uses in-memory storage (data lost on restart). Consider upgrading to Pinecone, Weaviate, or pgvector for production.
- **Web Search**: Uses basic DuckDuckGo scraping which may be unreliable. Consider integrating a proper search API (SerpAPI, Brave Search API).
- **Executor Agent**: Currently a placeholder. Implement actual execution logic for your use case.
- **Error Handling**: Basic error handling. Add comprehensive try-catch blocks and logging for production.

## Future Enhancements

- [ ] Persistent vector storage (Pinecone/Weaviate integration)
- [ ] Better web search API integration
- [ ] Implement actual executor agent functionality
- [ ] Add authentication and user management
- [ ] Streaming responses for real-time feedback
- [ ] Agent collaboration and communication
- [ ] Plugin system for custom agents
- [ ] Monitoring and logging dashboard

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for any purpose.

## Support

For issues, questions, or contributions, please open an issue on GitHub.

---

**Built with OpenAI GPT-4, PostgreSQL, and Express.js**
