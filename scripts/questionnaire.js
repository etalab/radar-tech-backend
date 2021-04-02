const questionnaire = {
  title: '',
  description: '',
  pages: [
    {
      name: 'page1',
      title: 'Qui sont ces informaticien·ne·s ?',
      elements: [
        {
          type: 'radiogroup',
          name: 'demo_genre',
          title: 'À quel genre vous identifiez-vous ?',
          // isRequired: true,
          choices: [
            'Homme',
            'Femme',
            'Non-binaire, genderqueer, ou gender non-conforming',
          ],
        },
        {
          type: 'dropdown',
          name: 'demo_age',
          title: 'Dans quelle tranche d’âge vous situez vous ?',
          choices: [
            '15-19',
            '20-24',
            '25-29',
            '30-34',
            '35-39',
            '40-44',
            '45-49',
            '50-54',
            '55-59',
            '60-64',
            '65+',
          ],
        },
        {
          type: 'matrix',
          name: 'question1',
          title: 'Votre avis sur',
          columns: [
            'Column 1',
            'Column 2',
            'Column 3',
          ],
          rows: [
            'Row 1',
            'Row 2',
          ],
        },
        {
          type: 'matrix',
          name: 'question2',
          title: 'Votre avis sur',
          columns: [
            'Column 1',
            'Column 2',
            'Column 3',
          ],
          rows: [
            'Row 4',
            'Row 5',
          ],
        },
      ],
    },
    {
      name: 'page2',
      title: 'Quelle est leur formation ?',
      elements: [
        {
          type: 'checkbox',
          name: 'demo_etudiant',
          title: 'Êtes-vous encore étudiant·e ?',
          choices: ['Oui', 'Non'],
          colCount: 2,
        },
      ],
    },
  ],
  showQuestionNumbers: 'off',
}

module.exports = questionnaire
