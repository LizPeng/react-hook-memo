// 作者：张立理
// 链接：https://www.zhihu.com/question/357020049/answer/909484669
// 来源：知乎
// 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
import React, {useState, useCallback, useMemo} from 'react';

const useUserList = () => {
    const [pending, setPending] = useState(false);
    const [users, setUsers] = useState([]);
    const load = async params => {
        setPending(true);
        setUsers([]);
        const users = await request('/users', params);
        setUsers(users);
        setPending(false);
    };
    const deleteUser = useCallback(
        user => setUsers(users => without(users, user)),
        []
    );
    const addUser = useCallback(
        user => setUsers(users => users.concat(user)),
        []
    );
    return [users, {pending, load, addUser, deleteUser}];
};

// 状态与操作封装
export const useMethods = (initialValue, methods) => {
    const [value, setValue] = useState(initialValue);
    const boundMethods = useMemo(
        () => Object.entries(methods).reduce(
            (methods, [name, fn]) => {
                const method = (...args) => {
                    setValue(value => fn(value, ...args));
                };
                methods[name] = method;
                return methods;
            },
            {}
        ),
        [methods]
    );
    return [value, boundMethods];
};


/**
 有了与任何类型都无关的基础的方法封装，我们就可以在它的基础上衍生出最常见的数据结构了。
 正如原生的数组有push、pop、slice等方法，
 原生的字符串有trim、padStart、repeat等方法，把这些东西包一包也能变成“数组hook”、“字符串hook”这样的基础hook。
 这里需要注意的是，你不能把useArray的push直接引到数组的push上去，因为我们对状态的更新要求是immutable的，
 所以push要对应concat，pop要对应slice，总之这是很容易的：
 */

// 封装常用数据结构
const arrayMethods = {
    push(state, item) {
        return state.concat(item);
    },
    pop(state) {
        return state.slice(0, -1);
    },
    slice(state, start, end) {
        return state.slice(start, end);
    },
    empty() {
        return [];
    },
    set(state, newValue) {
        return newValue;
    },
    remove(state, item) {
        const index = state.indexOf(item);
        if (index < 0) {
            return state;
        }
        return [...state.slice(0, index), ...state.slice(index + 1)];
    }
};

const useArray = (initialValue = []) => {
    invariant(Array.isArray(initialValue), 'initialValue must be an array');
    return useMethods(initialValue, arrayMethods);
};

/**
 * 
 */
const numberMethods = {
  increment(value) {
      return value + 1;
  },
  decrement(value) {
      return value - 1;
  },
  set(current, newValue) {
      return newValue;
  }
};

const useNumber = (initialValue = 0) => {
  invariant(typeof initialValue === 'number', 'initialValue must be an number');
  return useMethods(initialValue, numberMethods);
};

// 通用过程封装
const useTaskPending = task => {
  const [pendingCount, {increment, decrement}] = useNumber(0);
  const taskWithPending = useCallback(
      async (...args) => {
          increment();
          const result = await task(...args);
          decrement();
          return result;
      },
      [task, increment, decrement]
  );
  return [taskWithPending, pendingCount > 0];
};

// 同步到状态里
const useTaskPendingState = (task, storeResult) => {
    const [taskWithPending, pending] = useTaskPending(task);
    const callAndStore = useCallback(
        () => {
            const result = await taskWithPending();
            storeResult(result);
        },
        [taskWithPending, storeResult]
    );
    return [callAndStore, pending];
};

// 拼装成业务
const useUserList = () => {
    const [users, {push, remove, set}] = useArray([]);
    const [load, pending] = useTaskPendingState(listUsers, set);
    return [users, {pending, load, addUser: push, deleteUser: remove}];
};

// ///////////
/**
 * useCallback 
 * pass an inline callback and array of dep
 * return a memoized version callback 函数
 * diff: 多个callback
 */
const memoizedCallback = useCallback(
    () => {
        doSomething(a, b);
    },
    [a, b],
)
// useCallback(fn, deps) is equivalent to useMemo(() => fn, deps).
/**
 * useMemo
 * pass a "create" function and array of dep
 * return a memoized value 值
 * diff: a function
 */
const memoizedValue = useMemo(
    () => computeExpensiveValue(a, b), 
    [a, b]
)


