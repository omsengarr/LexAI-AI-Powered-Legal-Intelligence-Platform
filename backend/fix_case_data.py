from database import SessionLocal
from models import Case


UPDATES = {
    "1973 Supp SCR 1": {
        "court": "Supreme Court of India",
        "description": (
            "A landmark constitutional judgment concerning the extent "
            "of Parliament's power to amend the Constitution. The case "
            "is associated with the Basic Structure Doctrine, under which "
            "certain foundational features of the Constitution cannot be "
            "destroyed through the amendment power."
        ),
    },

    "2017 10 SCC 1": {
        "court": "Supreme Court of India",
        "description": (
            "A nine-judge constitutional bench considered whether privacy "
            "is constitutionally protected. The judgment recognized privacy "
            "as a constitutionally protected right connected with liberty, "
            "dignity and individual autonomy, including protection under "
            "Article 21 and other fundamental rights."
        ),
    },

    "2017 9 SCC 1": {
        "case_number": "2017 9 SCC 1",
        "court": "Supreme Court of India",
        "description": (
            "A constitutional challenge concerning the practice of "
            "Talaq-e-Bidaat, commonly known as instant triple talaq. "
            "The Constitution Bench considered the validity of the practice "
            "and set aside Talaq-e-Bidaat in its judgment."
        ),
    },

    "1997 6 SCC 241": {
        "court": "Supreme Court of India",
        "description": (
            "A public interest case concerning sexual harassment of women "
            "at the workplace. In the absence of specific legislation at "
            "the time, the Supreme Court laid down guidelines intended to "
            "prevent and address workplace sexual harassment."
        ),
    },
}


db = SessionLocal()

try:
    updated = 0

    for case_number, data in UPDATES.items():

        case = (
            db.query(Case)
            .filter(Case.case_number == case_number)
            .first()
        )

        if not case:
            print(f"NOT FOUND: {case_number}")
            continue

        for field, value in data.items():
            setattr(case, field, value)

        print(f"FIXED: {case.title}")
        updated += 1

    db.commit()

    print()
    print("===================================")
    print("CASE DATA CLEANUP COMPLETED")
    print("===================================")
    print(f"Updated: {updated}")
    print("===================================")

finally:
    db.close()