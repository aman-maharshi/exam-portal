import { Client, Databases, ID, Query } from 'appwrite';

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(PROJECT_ID)

const database = new Databases(client)


export const updateTestResult = async (testId, studentName, percentage) => {
  try {
    const response = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal('testId', testId),
      Query.equal('studentName', studentName),
    ])

    if (response.documents.length > 0) {
      const documentId = response.documents[0].$id;
      await database.updateDocument(DATABASE_ID, COLLECTION_ID, documentId, {
        marksPercentage: percentage,
        date: new Date().toISOString()
      });
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        testId: testId,
        studentName: studentName,
        marksPercentage: percentage,
        date: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error(error)
  }
}

export const getTestResults = async () => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(100),
      Query.orderAsc('studentName')
    ])
    return result.documents

  } catch (error) {
    console.error(error)
  }
}