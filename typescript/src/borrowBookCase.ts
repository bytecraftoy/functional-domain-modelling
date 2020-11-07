abstract class Result<T, E> { }
class Success<T, E> extends Result<T, E> {
    readonly success: T
    constructor(success: T) {
        super()
        this.success = success
    }
}
class Failure<T, E> extends Result<T, E> {
    readonly failure: E
    constructor(failure: E) {
        super()
        this.failure = failure
    }
}

type UnvalidatedUserId = { readonly unvalidatedUserId: number }
type UnvalidatedBookId = { readonly unvalidatedBookId: number }
type ValidUserId = { readonly validUserId: number }
type ValidBookId = { readonly validBookId: number }

type Borrowed = { validUserId: ValidUserId, validBookId: ValidBookId }

abstract class BorrowFailure {
}
class BookNotCurrentlyAvailable extends BorrowFailure {
    readonly validUserId: ValidUserId
    readonly validBookId: ValidBookId
    constructor(validUserId: ValidUserId, validBookId: ValidBookId) {
        super()
        this.validUserId = validUserId
        this.validBookId = validBookId
    }
}
class BookNotFound extends BorrowFailure {
    readonly unvalidatedBookId: UnvalidatedBookId
    constructor(unvalidatedBookId: UnvalidatedBookId) {
        super()
        this.unvalidatedBookId = unvalidatedBookId
    }
}
class UserNotFound extends BorrowFailure {
    readonly unvalidatedUserId: UnvalidatedUserId
    constructor(unvalidatedUserId: UnvalidatedUserId) {
        super()
        this.unvalidatedUserId = unvalidatedUserId
    }
}

type ValidateUserId = (unvalidatedUserId: UnvalidatedUserId) => ValidUserId
type ValidateBookId = (unvalidatedBookId: UnvalidatedBookId) => ValidBookId
type MarkBookBorrowed = (validUserId: ValidUserId, ValidBookId: ValidBookId) => Borrowed

type BorrowBook =
    (validateUserId: ValidateUserId, validateBookId: ValidateBookId, barkBookBorrowed: MarkBookBorrowed) =>   // dependencies
        (unvalidatedUserId: UnvalidatedUserId, unvalidatedBookId: UnvalidatedBookId) => Result<Borrowed, BorrowFailure>
