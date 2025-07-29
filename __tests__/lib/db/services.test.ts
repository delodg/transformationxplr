import * as services from '../../../lib/db/services'

// Mock the database
jest.mock('../../../lib/db', () => ({
  db: {
    insert: jest.fn(() => ({
      values: jest.fn(() => ({
        returning: jest.fn(() => Promise.resolve([{ id: 'test-id' }])),
      })),
    })),
    select: jest.fn(() => ({
      from: jest.fn(() => ({
        where: jest.fn(() => ({
          orderBy: jest.fn(() => Promise.resolve([])),
          limit: jest.fn(() => Promise.resolve([])),
        })),
        orderBy: jest.fn(() => Promise.resolve([])),
      })),
    })),
    update: jest.fn(() => ({
      set: jest.fn(() => ({
        where: jest.fn(() => ({
          returning: jest.fn(() => Promise.resolve([{ id: 'test-id' }])),
        })),
      })),
    })),
    delete: jest.fn(() => ({
      where: jest.fn(() => Promise.resolve()),
    })),
  },
  companies: {},
  aiInsights: {},
  workflowPhases: {},
  chatMessages: {},
  questionnaires: {},
  analysisResults: {},
  userSessions: {},
}))

import { db } from '../../../lib/db'

describe('Database Services', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Company Services', () => {
    describe('createCompany', () => {
      it('should create a new company', async () => {
        const newCompany = {
          id: 'company-1',
          clientName: 'Test Company',
          industry: 'Technology',
          userId: 'user-1',
        }

        const mockInsert = db.insert as jest.Mock
        mockInsert().values().returning.mockResolvedValue([newCompany])

        const result = await services.createCompany(newCompany)

        expect(result).toEqual(newCompany)
        expect(mockInsert).toHaveBeenCalled()
      })
    })

    describe('getCompaniesByUser', () => {
      it('should return companies for a user', async () => {
        const mockCompanies = [
          { id: 'company-1', clientName: 'Company 1', userId: 'user-1' },
          { id: 'company-2', clientName: 'Company 2', userId: 'user-1' },
        ]

        const mockSelect = db.select as jest.Mock
        mockSelect().from().where().orderBy.mockResolvedValue(mockCompanies)

        const result = await services.getCompaniesByUser('user-1')

        expect(result).toEqual(mockCompanies)
        expect(mockSelect).toHaveBeenCalled()
      })
    })

    describe('getCompanyById', () => {
      it('should return a company by id', async () => {
        const mockCompany = { id: 'company-1', clientName: 'Test Company' }

        const mockSelect = db.select as jest.Mock
        mockSelect().from().where().limit.mockResolvedValue([mockCompany])

        const result = await services.getCompanyById('company-1')

        expect(result).toEqual(mockCompany)
      })

      it('should return null if company not found', async () => {
        const mockSelect = db.select as jest.Mock
        mockSelect().from().where().limit.mockResolvedValue([])

        const result = await services.getCompanyById('non-existent')

        expect(result).toBeNull()
      })
    })

    describe('updateCompany', () => {
      it('should update a company', async () => {
        const updatedCompany = {
          id: 'company-1',
          clientName: 'Updated Company',
          progress: 50,
        }

        const mockUpdate = db.update as jest.Mock
        mockUpdate().set().where().returning.mockResolvedValue([updatedCompany])

        const result = await services.updateCompany('company-1', { progress: 50 })

        expect(result).toEqual(updatedCompany)
        expect(mockUpdate).toHaveBeenCalled()
      })
    })

    describe('deleteCompany', () => {
      it('should delete a company', async () => {
        const mockDelete = db.delete as jest.Mock
        mockDelete().where.mockResolvedValue(undefined)

        await services.deleteCompany('company-1')

        expect(mockDelete).toHaveBeenCalled()
      })
    })
  })

  describe('AI Insights Services', () => {
    describe('createAIInsight', () => {
      it('should create a new AI insight', async () => {
        const newInsight = {
          id: 'insight-1',
          title: 'Test Insight',
          type: 'recommendation',
          companyId: 'company-1',
        }

        const mockInsert = db.insert as jest.Mock
        mockInsert().values().returning.mockResolvedValue([newInsight])

        const result = await services.createAIInsight(newInsight)

        expect(result).toEqual(newInsight)
      })
    })

    describe('getAIInsightsByCompany', () => {
      it('should return AI insights for a company', async () => {
        const mockInsights = [
          { id: 'insight-1', title: 'Insight 1', companyId: 'company-1' },
          { id: 'insight-2', title: 'Insight 2', companyId: 'company-1' },
        ]

        const mockSelect = db.select as jest.Mock
        mockSelect().from().where().orderBy.mockResolvedValue(mockInsights)

        const result = await services.getAIInsightsByCompany('company-1')

        expect(result).toEqual(mockInsights)
      })
    })

    describe('bulkCreateAIInsights', () => {
      it('should create multiple AI insights', async () => {
        const insights = [
          { id: 'insight-1', title: 'Insight 1' },
          { id: 'insight-2', title: 'Insight 2' },
        ]

        const mockInsert = db.insert as jest.Mock
        mockInsert().values().returning.mockResolvedValue(insights)

        const result = await services.bulkCreateAIInsights(insights)

        expect(result).toEqual(insights)
      })

      it('should return empty array for empty input', async () => {
        const result = await services.bulkCreateAIInsights([])

        expect(result).toEqual([])
        expect(db.insert).not.toHaveBeenCalled()
      })
    })
  })

  describe('Utility Functions', () => {
    describe('generateId', () => {
      it('should generate a unique ID', () => {
        const id1 = services.generateId()
        const id2 = services.generateId()

        expect(id1).toBeDefined()
        expect(id2).toBeDefined()
        expect(id1).not.toEqual(id2)
        expect(typeof id1).toBe('string')
        expect(id1.length).toBeGreaterThan(0)
      })
    })

    describe('parseJSONField', () => {
      it('should parse valid JSON', () => {
        const result = services.parseJSONField('["item1", "item2"]', [])
        expect(result).toEqual(['item1', 'item2'])
      })

      it('should return default value for invalid JSON', () => {
        const result = services.parseJSONField('invalid json', ['default'])
        expect(result).toEqual(['default'])
      })

      it('should return default value for null input', () => {
        const result = services.parseJSONField(null, ['default'])
        expect(result).toEqual(['default'])
      })
    })

    describe('stringifyJSONField', () => {
      it('should stringify object to JSON', () => {
        const result = services.stringifyJSONField({ key: 'value' })
        expect(result).toBe('{"key":"value"}')
      })

      it('should stringify array to JSON', () => {
        const result = services.stringifyJSONField(['item1', 'item2'])
        expect(result).toBe('["item1","item2"]')
      })
    })
  })

  describe('Chat Message Services', () => {
    describe('createChatMessage', () => {
      it('should create a new chat message', async () => {
        const newMessage = {
          id: 'message-1',
          content: 'Test message',
          role: 'user',
          companyId: 'company-1',
        }

        const mockInsert = db.insert as jest.Mock
        mockInsert().values().returning.mockResolvedValue([newMessage])

        const result = await services.createChatMessage(newMessage)

        expect(result).toEqual(newMessage)
      })
    })

    describe('getChatMessagesByCompany', () => {
      it('should return chat messages for a company', async () => {
        const mockMessages = [
          { id: 'message-1', content: 'Message 1', companyId: 'company-1' },
          { id: 'message-2', content: 'Message 2', companyId: 'company-1' },
        ]

        const mockSelect = db.select as jest.Mock
        mockSelect().from().where().orderBy.mockResolvedValue(mockMessages)

        const result = await services.getChatMessagesByCompany('company-1')

        expect(result).toEqual(mockMessages)
      })
    })
  })

  describe('Workflow Phases Services', () => {
    describe('createWorkflowPhase', () => {
      it('should create a new workflow phase', async () => {
        const newPhase = {
          id: 'phase-1',
          title: 'Phase 1',
          phaseNumber: 1,
          companyId: 'company-1',
        }

        const mockInsert = db.insert as jest.Mock
        mockInsert().values().returning.mockResolvedValue([newPhase])

        const result = await services.createWorkflowPhase(newPhase)

        expect(result).toEqual(newPhase)
      })
    })

    describe('getWorkflowPhasesByCompany', () => {
      it('should return workflow phases for a company', async () => {
        const mockPhases = [
          { id: 'phase-1', title: 'Phase 1', companyId: 'company-1' },
          { id: 'phase-2', title: 'Phase 2', companyId: 'company-1' },
        ]

        const mockSelect = db.select as jest.Mock
        mockSelect().from().where().orderBy.mockResolvedValue(mockPhases)

        const result = await services.getWorkflowPhasesByCompany('company-1')

        expect(result).toEqual(mockPhases)
      })
    })
  })
}) 