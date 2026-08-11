export function registerContentRoutes(app, {
  defaultChallenge,
  getChallenge,
  normalizeLanguage,
  getChallengeAssetContent,
  loadTestCases,
  getLanguageAdapterPath,
  loadAdapter,
  preferFile = process.env.NODE_ENV === 'test',
  logger = console
}) {
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/api/template', async (req, res) => {
    try {
      const challengeId = req.query.challenge || defaultChallenge;
      const challenge = getChallenge(challengeId);
      const language = normalizeLanguage(req.query.language);
      const templateContent = await getChallengeAssetContent({
        challengeId,
        folder: challenge.folder,
        type: 'template',
        language,
        preferFile
      });
      if (!templateContent) {
        throw new Error('Failed to load template');
      }
      res.json({ code: templateContent });
    } catch (error) {
      logger.error('Template error:', error);
      res.status(500).json({
        error: error.message || 'Failed to load template'
      });
    }
  });

  app.get('/api/description', async (req, res) => {
    try {
      const challengeId = req.query.challenge || defaultChallenge;
      const challenge = getChallenge(challengeId);
      const descriptionContent = await getChallengeAssetContent({
        challengeId,
        folder: challenge.folder,
        type: 'description_html',
        preferFile
      });
      if (!descriptionContent) {
        throw new Error('Failed to load description');
      }
      res.json({ description: descriptionContent });
    } catch (error) {
      logger.error('Description error:', error);
      res.status(500).json({
        error: error.message || 'Failed to load description'
      });
    }
  });

  app.get('/api/test-cases', async (req, res) => {
    try {
      const challengeId = req.query.challenge || defaultChallenge;
      const language = normalizeLanguage(req.query.language);
      const { runTests, submitTests } = await loadTestCases(challengeId, language);
      const challenge = getChallenge(challengeId);
      const adapterPath = getLanguageAdapterPath(challenge, language, challengeId);
      const adapter = await loadAdapter(adapterPath);

      const toPreview = (test) => {
        const extractedInput = adapter.extractInput(test);
        const fallbackValue = Object.values(extractedInput)[0] || null;
        const inputValue = test.input !== undefined ? test.input : fallbackValue;
        const normalizedInput = typeof inputValue === 'object' && inputValue !== null
          ? JSON.stringify(inputValue)
          : inputValue;
        return {
          id: test.id,
          name: test.name,
          input: normalizedInput
        };
      };

      res.json({
        runTests: runTests.map(toPreview),
        submitTests: submitTests.map(toPreview)
      });
    } catch (error) {
      logger.error('Test cases error:', error);
      res.status(500).json({
        error: error.message || 'Internal server error'
      });
    }
  });
}
