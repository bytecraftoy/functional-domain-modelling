namespace TypesOnly {
  type Success<T> = { readonly success: T }
  type Failure<E> = { readonly failure: E } 
  type Result<T, E> = Success<T> | Failure<E>
  
  type UnvalidatedUserId = {
    readonly __typename: 'UnvalidatedUserId',
    readonly id: number 
  }
  type UnvalidatedBookId = {
    readonly __typename: 'UnvalidatedBookId',
    readonly id: number 
  }
  type ValidUserId = { readonly __typename: 'ValidUserId', readonly id: number }
  type ValidBookId = { readonly __typename: 'ValidBookId', readonly id: number }
  type InvalidUserId = { readonly __typename: 'InvalidUserId', readonly id: number }
  type InvalidBookId = { readonly __typename: 'InvalidBookId', readonly id: number }
  
  type ValidatedUserId = ValidUserId | InvalidUserId
  type ValidatedBookId = ValidBookId | InvalidBookId
  
  type Borrowed = {
    readonly __typename: 'Borrowed',
    readonly validUserId: ValidUserId,
    readonly validBookId: ValidBookId 
  }
  type BookNotCurrentlyAvailable = {
    readonly __typename: 'BookNotCurrentlyAvailable',
    readonly validUserId: ValidUserId
    readonly validBookId: ValidBookId
  }
  type Borrow = Borrowed | BookNotCurrentlyAvailable
  
  type BookNotFound = { readonly __typename: 'BookNotFound', readonly id: InvalidBookId }
  type UserNotFound = { readonly __typename: 'UserNotFound', readonly id: InvalidUserId }
  type BorrowFailure = BookNotCurrentlyAvailable | BookNotFound | UserNotFound
  
  type ValidateUserId = (unvalidatedUserId: UnvalidatedUserId) => ValidatedUserId
  type ValidateBookId = (unvalidatedBookId: UnvalidatedBookId) => ValidatedBookId
  type MarkBookBorrowed = (validUserId: ValidUserId, ValidBookId: ValidBookId) => Borrow
  
  type BorrowBook =
      (validateUserId: ValidateUserId, validateBookId: ValidateBookId, barkBookBorrowed: MarkBookBorrowed) =>   // dependencies
          (unvalidatedUserId: UnvalidatedUserId, unvalidatedBookId: UnvalidatedBookId) => Result<Borrowed, BorrowFailure>
  
  const createUserNotFound = (id: InvalidUserId): UserNotFound => ({id: id, __typename: 'UserNotFound'})
  const createBookNotFound = (id: InvalidBookId): BookNotFound => ({id: id, __typename: 'BookNotFound'})
  
  const borrowBook = 
    (validateUserId: ValidateUserId, validateBookId: ValidateBookId, markBookBorrowed: MarkBookBorrowed) => 
      (unvalidatedUserId: UnvalidatedUserId, unvalidatedBookId: UnvalidatedBookId): Result<Borrowed, BorrowFailure> => {
        const validatedUserId = validateUserId(unvalidatedUserId)
        if (validatedUserId.__typename === "InvalidUserId") {
          const userNotFound = createUserNotFound(validatedUserId as InvalidUserId)
          return {failure: userNotFound}
        }
        const validatedBookId = validateBookId(unvalidatedBookId)
        if (validatedBookId.__typename === "InvalidBookId") {
          const bookNotFound = createBookNotFound(validatedBookId as InvalidBookId)
          return {failure: bookNotFound}
        }
  
        const validUserId = validatedUserId as ValidUserId
        const validBookId = validatedBookId as ValidBookId
        const borrow = markBookBorrowed(validUserId, validBookId)
  
        if (borrow.__typename === "BookNotCurrentlyAvailable") {
          return {failure: borrow as BookNotCurrentlyAvailable}
        }
        
        return {success: borrow as Borrowed}
  }
}

