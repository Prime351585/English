import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import quizData from '../../assets/quiz/data.json';

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const QuizComponent = ({colorScheme}) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    // Load all questions when the component mounts
    const shuffledQuestions = quizData.questions.map((question) => ({
      ...question,
      options: shuffleArray([...question.options]),
    }));
    setQuestions(shuffledQuestions);
  }, []);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = (selected) => {
    setSelectedAnswer(selected);
    setShowExplanation(true);
  };
  const previousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => 
      prevIndex > 0 ? prevIndex - 1 : questions.length - 1
    );
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const nextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => 
      prevIndex < questions.length - 1 ? prevIndex + 1 : 0
    );
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  if (!currentQuestion) {
    return <Text>Loading...</Text>;
  }
  return (
    <SafeAreaView style={[styles.container]}>
      <Text style={[styles.questionText,{color: (colorScheme ?? "light") === "light" ? "black" : "white"}]}>
      Question {currentQuestionIndex + 1} of {questions.length}
      </Text>
      <Text style={[styles.questionText,{color: (colorScheme ?? "light") === "light" ? "black" : "white"}]}>
        {currentQuestion.type === 'synonyms' ? 'Synonym' : 'Antonym'} of {currentQuestion.word}:
      </Text>
      {currentQuestion.options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.optionButton,
            selectedAnswer && {
              backgroundColor: 
                option === currentQuestion.correct_answer
                  ? '#90EE90'  // Light green for correct answer
                  : option === selectedAnswer
                    ? '#FFA07A'  // Light salmon for incorrect selected answer
                    : '#e0e0e0'  // Default color
            }
          ]}
          onPress={() => handleAnswer(option)}
          disabled={selectedAnswer !== null}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
  {showExplanation && (
  <View style={styles.explanationContainer}>
    <Text style={styles.explanationText}>
      <Text style={styles.explanationLabel}>Explanation</Text>
      {"\n"}
      <Text style={{color: '#000000'}}>
        <Text style={{fontWeight: 'bold'}}>Synonyms:</Text> {currentQuestion.synonyms}
      </Text>
      {"\n"}
      <Text style={{color: '#000000'}}>
        <Text style={{fontWeight: 'bold'}}>Antonyms:</Text> {currentQuestion.antonyms}
      </Text>
      {"\n"}
      <Text style={{color: '#000000'}}>
        <Text style={{fontWeight: 'bold'}}>Example:</Text> {currentQuestion.example}
      </Text>
    </Text>
  </View>
)}

{
  <View style={styles.navigationButtons}>
    <TouchableOpacity onPress={previousQuestion} style={styles.navButton}>
      <Text style={styles.navButtonText}>Previous</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={nextQuestion} style={styles.navButton}>
      <Text style={styles.navButtonText}>Next</Text>
    </TouchableOpacity>
  </View>
}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    marginTop:100,
    // justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  questionText: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    color: '#ffffff',
  },
  optionButton: {
    backgroundColor: '#e0e0e0',
    padding: 15,
    marginVertical: 8,
    width: '100%',
    alignItems: 'center',
    borderRadius: 8,
  },
  optionText: {
    fontSize: 16,
  },
  explanationContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    width: '100%',
  },
  explanationLabel: {
    fontWeight: 'bold',
  },
  explanationText: {
    fontSize: 14,
    lineHeight: 20,
  },

  navigationButtons: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  navButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default QuizComponent;