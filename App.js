import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, StatusBar, TouchableOpacity, FlatList, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';

import TaskList from './src/components/TaskList';

// Cria component personalizado
const AnimatedBtn = Animatable.createAnimatableComponent(TouchableOpacity);

export default function App() {

  const [ task, setTask ] = useState([]);
  const [ open, setOpen ] = useState(false);
  const [ input, setInput ] = useState('');

  // Busca todas as tarefas ao iniciar o app
  useEffect(() => {

    async function loadTasks() {
      const taskStorage = await AsyncStorage.getItem('@task');

      if(taskStorage) {
        setTask(JSON.parse(taskStorage));
      }
    }
    loadTasks();
  }, []);

  // salva caso tenha alguma tarefa alterada
  useEffect(() => {

    async function saveTasks() {
      await AsyncStorage.setItem('@task', JSON.stringify(task));
    }    
    saveTasks();
  }, [task]);

  function handleAdd() {
    if(input === '') return;

    const data = {
      key: input,
      task: input
    };

    setTask([...task, data]);
    setOpen(false);
    setInput('');
  }

  const handleDelete = useCallback((data) => {
    const find = task.filter(r => r.key !== data.key);
    setTask(find);
  }) 

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#19181f" barStyle="light-content" />
        
        <View style={styles.content}>
          <Text style={styles.title}>Minhas tarefas</Text>
        </View>

        <FlatList 
        marginHorizontal={ 10 }
        showsHorizontalScrollIndicator={false}
        data={task}
        keyExtractor={( item ) => String(item.key)}
        renderItem={ ({ item }) => <TaskList data={ item } handleDelete={ handleDelete } /> }        
        />

        <Modal animationType="slide" transparent={false} visible={open} >
          <SafeAreaView style={styles.modal}>
            
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={ () => setOpen(false) }>
                <Ionicons style={{marginLeft: 5, marginRight: 5} } name="md-arrow-back" size={40} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Nova tarefa</Text>
            </View>

            <Animatable.View style={styles.modalBody}
              animation="fadeInUp" useNativeDriver >
              <TextInput
                multiline={true}
                placeholderTextColor="#747474"
                autoCorrect={false}
                placeholder="Qual sua tarefa?"
                style={styles.input}
                value={input}
                onChangeText={ (texto) => setInput(texto) } 
              />

              <TouchableOpacity style={styles.handleAdd} onPress={ handleAdd }>
                <Text style={styles.handleAddtext}>Cadastrar</Text>
              </TouchableOpacity>
            </Animatable.View>

          </SafeAreaView>
        </Modal>

        <AnimatedBtn style={styles.fab}
        useNativeDriver
        animation="bounceInUp"
        duration={1500}
        onPress={ () => setOpen(true) }>
          <Ionicons name="ios-add" size={35} color="#fff" />
        </AnimatedBtn>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#19181f',
    flex: 1
  },
  title: {
    marginTop: 10,
    paddingBottom: 10,
    fontSize: 25,
    textAlign: 'center',
    color: '#fff'
  },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    backgroundColor: '#7159c1',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    right: 25,
    bottom: 25,
    elevation: 2,
    zIndex: 9,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 1,
      height: 3,
    }
  },
  modal: {
    backgroundColor: '#19181f',
    flex: 1
  },
  modalHeader: {
    marginLeft: 10,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  modalTitle: {
    marginLeft: 15,
    fontSize: 20,
    color: '#fff'
  },
  modalBody: {
    marginTop: 15,
  },
  input: {
    fontSize: 15,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 30,
    backgroundColor: '#fff',
    padding: 9,
    height: 90,
    textAlignVertical: 'top',
    color: '#000',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#7159c1',
  },
  handleAdd: {
    backgroundColor: '#fff',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 10,
    height: 40,
    borderRadius: 5
  },
  handleAddtext: {
    fontSize: 20
  }
});
