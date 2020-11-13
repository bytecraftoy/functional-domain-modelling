abstract class Result<T, E> { }
class Success<T, E> extends Result<T, E> {
    constructor(public readonly success: T) {
        super()
    }
}
class Failure<T, E> extends Result<T, E> {
    constructor(public readonly failure: E) {
        super()
    }
}

type UnvalidatedUserId = { readonly unvalidatedUserId: number }
type UnvalidatedBookId = { readonly unvalidatedBookId: number }
type ValidUserId = { readonly validUserId: number }
type ValidBookId = { readonly validBookId: number }

type Borrowed = { validUserId: ValidUserId, validBookId: ValidBookId }

class BookNotCurrentlyAvailable {
    constructor(public readonly validUserId: ValidUserId, public readonly validBookId: ValidBookId) {
    }
}
class BookNotFound {
    constructor(public readonly unvalidatedBookId: UnvalidatedBookId) {
    }
}
class UserNotFound {
    constructor(public readonly unvalidatedUserId: UnvalidatedUserId) {
    }
}

type BorrowFailure = BookNotCurrentlyAvailable | BookNotFound | UserNotFound

type ValidateUserId = (unvalidatedUserId: UnvalidatedUserId) => ValidUserId | undefined
type ValidateBookId = (unvalidatedBookId: UnvalidatedBookId) => ValidBookId | undefined
type MarkBookBorrowed = (validUserId: ValidUserId, ValidBookId: ValidBookId) => Borrowed | undefined

type BorrowBook =
    (validateUserId: ValidateUserId, validateBookId: ValidateBookId, barkBookBorrowed: MarkBookBorrowed) =>   // dependencies
        (unvalidatedUserId: UnvalidatedUserId, unvalidatedBookId: UnvalidatedBookId) => Result<Borrowed, BorrowFailure>

const borrowBook: BorrowBook =
    (validateUserId: ValidateUserId, validateBookId: ValidateBookId, markBookBorrowed: MarkBookBorrowed) =>
        (unvalidatedUserId: UnvalidatedUserId, unvalidatedBookId: UnvalidatedBookId) => {
            let validUserId = validateUserId(unvalidatedUserId)
            let validBookId = validateBookId(unvalidatedBookId)
            if (!validUserId) {
                return new Failure(new UserNotFound(unvalidatedUserId))
            } else if (!validBookId) {
                return new Failure(new BookNotFound(unvalidatedBookId))
            } else {
                let borrow = markBookBorrowed(validUserId, validBookId)
                if (!borrow) {
                    return new Failure(new BookNotCurrentlyAvailable(validUserId, validBookId))
                } else {
                    return new Success(borrow)
                }
            }
        }
