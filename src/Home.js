import React, { useState, useEffect } from 'react';
import supabase from './supabaseClient';

export default function Home() {
  // ---------------------------
  // TYPED TEXT EFFECT (HERO)
  // ---------------------------
  const [typedText, setTypedText] = useState('');
  const fullText = 'strangers.';
  useEffect(() => {
    let index = 0;
    const timer = setTimeout(function type() {
      if (index < fullText.length) {
        setTypedText((prev) => prev + fullText.charAt(index));
        index++;
        setTimeout(type, 200);
      }
    }, 3000); // 3s delay before starting
    return () => clearTimeout(timer);
  }, []);

  // ---------------------------
  // MODAL STATE
  // ---------------------------
  const [modalOpen, setModalOpen] = useState(false);
  function openModal() {
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    setModalOpen(false);
    document.body.style.overflow = 'auto';
  }

  // ---------------------------
  // MULTI-STEP FORM STATES
  // ---------------------------
  const [currentStep, setCurrentStep] = useState(1);

  // Basic info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 2: major, class level, interests
  const [selectedMajors, setSelectedMajors] = useState([]);
  const [classLevel, setClassLevel] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);

  // Step 3: meal plan, guest swipe, locations, meal times
  const [mealPlan, setMealPlan] = useState(false);
  const [guestSwipe, setGuestSwipe] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null); // track which day bubble is open
  const [mealTimes, setMealTimes] = useState({
    monday: { breakfast: [], lunch: [], dinner: [] },
    tuesday: { breakfast: [], lunch: [], dinner: [] },
    wednesday: { breakfast: [], lunch: [], dinner: [] },
    thursday: { breakfast: [], lunch: [], dinner: [] },
    friday: { breakfast: [], lunch: [], dinner: [] },
    saturday: { breakfast: [], lunch: [], dinner: [] },
    sunday: { breakfast: [], lunch: [], dinner: [] },
  });

  // Final: show success message
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  // ---------------------------
  // HELPER: Toggle bubble selection
  // ---------------------------
  function toggleSelection(array, setArray, value) {
    if (array.includes(value)) {
      setArray(array.filter((item) => item !== value));
    } else {
      setArray([...array, value]);
    }
  }

  // ---------------------------
  // STEP NAVIGATION
  // ---------------------------
  function goToStep2() {
    if (!email.endsWith('@brandeis.edu')) {
      alert('Please use your brandeis email (@brandeis.edu).');
      return;
    }
    setCurrentStep(2);
  }
  function goBackToStep1() {
    setCurrentStep(1);
  }
  function goToStep3() {
    setCurrentStep(3);
  }
  function goBackToStep2() {
    setCurrentStep(2);
  }

  // ---------------------------
  // SUBMIT FORM: Sign up + Insert
  // ---------------------------
  const [loading, setLoading] = useState(false);
  async function handleSubmit() {
    // Basic checks
    if (password.length < 6) {
      alert('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    setLoading(true);
    // 1) Supabase Auth Sign Up
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email,
        password,
      }
    );
    if (signUpError) {
      alert('Sign-up error: ' + signUpError.message);
      setLoading(false);
      return;
    }
    const user = signUpData.user;
    if (!user) {
      alert('No user returned from sign up. Check your Supabase settings.');
      setLoading(false);
      return;
    }
    console.log('Meal times state before insert:', mealTimes);

    // 2) Insert into "Main" table
    const { error: insertError } = await supabase.from('Main').insert([
      {
        auth_id: user.id,
        name: name.trim(),
        email: email.trim(),
        majors: selectedMajors,
        class_level: classLevel,
        interests: selectedInterests,
        meal_plan: mealPlan,
        guest_swipe: guestSwipe,
        preferred_dining_locations: selectedLocations,
        meal_times: mealTimes,
      },
    ]);
    if (insertError) {
      alert('Error inserting into Main: ' + insertError.message);
      setLoading(false);
      return;
    }

    // 3) Show success step
    setSignUpSuccess(true);
    setCurrentStep(4);
    setLoading(false);
  }

  // ---------------------------
  // RENDER
  // ---------------------------
  return (
    <div style={{ position: 'relative' }}>
      {/* Cloud background */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          background: 'linear-gradient(#a2cfff, #ffffff)',
          overflow: 'hidden',
        }}
      >
        {/* Example clouds */}
        <div
          style={{
            position: 'absolute',
            background: '#fff',
            borderRadius: '50%',
            filter: 'blur(8px)',
            opacity: 0.7,
            animation: 'floatClouds 60s linear infinite',
            width: 200,
            height: 100,
            top: '20%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            background: '#fff',
            borderRadius: '50%',
            filter: 'blur(8px)',
            opacity: 0.7,
            animation: 'floatClouds 60s linear infinite',
            width: 150,
            height: 75,
            top: '50%',
            animationDelay: '15s',
          }}
        />
        <div
          style={{
            position: 'absolute',
            background: '#fff',
            borderRadius: '50%',
            filter: 'blur(8px)',
            opacity: 0.7,
            animation: 'floatClouds 60s linear infinite',
            width: 250,
            height: 125,
            top: '70%',
            animationDelay: '30s',
          }}
        />
      </div>

      {/* Keyframes for cloud animation (inline style fallback) */}
      <style>
        {`
          @keyframes floatClouds {
            0% { transform: translateX(-100vw); }
            100% { transform: translateX(100vw); }
          }
        `}
      </style>

      {/* Sticky Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          width: '100%',
          background: '#ffffffcc',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 3rem',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        }}
      >
        <div
          style={{
            fontSize: '1.6rem',
            fontWeight: 'bold',
            color: '#003865',
            textTransform: 'lowercase',
          }}
        >
          strangers.
        </div>
        <nav
          style={{ display: 'flex', gap: '1rem', textTransform: 'lowercase' }}
        >
          <a href="#problem" style={navLinkStyle}>
            problem
          </a>
          <a href="#features" style={navLinkStyle}>
            features
          </a>
          <a
            href="#!"
            style={navLinkStyle}
            onClick={(e) => {
              e.preventDefault();
              openModal();
            }}
          >
            sign up
          </a>
        </nav>
      </header>

      {/* Hero section */}
      <section
        className="hero"
        style={{
          width: '100%',
          maxWidth: 1200,
          margin: '0 auto',
          padding: '4rem 1rem',
          textAlign: 'center',
        }}
      >
        <h1
          className="typed-hero"
          style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#003865',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            marginBottom: '1rem',
          }}
        >
          {typedText}
        </h1>
        <h2
          style={{
            fontSize: '2rem',
            marginBottom: '1rem',
            textTransform: 'lowercase',
          }}
        >
          brandeis meal match
        </h2>
        <p
          style={{
            maxWidth: 600,
            margin: '0 auto 2rem auto',
            textTransform: 'lowercase',
          }}
        >
          connecting random brandeis students for meals, because sometimes
          meeting strangers is exactly what you need.
        </p>
        <button
          onClick={openModal}
          style={{
            padding: '0.7rem 2rem',
            background: '#003865',
            border: 'none',
            color: '#fff',
            borderRadius: 30,
            fontSize: '1.1rem',
            fontFamily: '"Courier New", Courier, monospace',
            textTransform: 'lowercase',
            cursor: 'pointer',
            transition: 'transform 0.3s, box-shadow 0.3s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,56,101,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          sign up
        </button>
      </section>

      {/* Problem statement */}
      <section
        id="problem"
        style={{
          // opacity: 0,
          transform: 'translateY(20px)',
          transition: 'opacity 0.8s, transform 0.8s',
          padding: '2rem',
          margin: '2rem auto',
          borderRadius: 8,
          maxWidth: 900,
        }}
        className="fade-in"
      >
        <div
          style={{
            textAlign: 'center',
            textTransform: 'lowercase',
            maxWidth: 800,
            margin: '0 auto',
          }}
        >
          <h2
            style={{
              fontSize: '2rem',
              marginBottom: '1rem',
              textTransform: 'lowercase',
            }}
          >
            the problem
          </h2>
          <p>
            being on campus can be lonely. schedules rarely align, and it’s
            tough finding new friends beyond your classes or clubs.
          </p>
          <p style={{ marginTop: '1rem' }}>
            strangers. solves this by matching you with another student,
            randomly, for a guaranteed meal-time meetup.
          </p>
        </div>
      </section>

      {/* Features section */}
      <section
        id="features"
        style={{
          // opacity: 0,
          transform: 'translateY(20px)',
          transition: 'opacity 0.8s, transform 0.8s',
          padding: '2rem',
          maxWidth: 1200,
          margin: '0 auto',
        }}
        className="fade-in"
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '2rem',
            marginTop: '3rem',
          }}
        >
          <div style={featureCardStyle}>
            <h3 style={{ marginBottom: '1rem', textTransform: 'lowercase' }}>
              random matching
            </h3>
            <p style={{ textTransform: 'lowercase' }}>
              you’ll be paired with someone new every time, broadening your
              network.
            </p>
          </div>
          <div style={featureCardStyle}>
            <h3 style={{ marginBottom: '1rem', textTransform: 'lowercase' }}>
              customize preferences
            </h3>
            <p style={{ textTransform: 'lowercase' }}>
              pick your dining halls, meal times, class level, major, and
              interests.
            </p>
          </div>
          <div style={featureCardStyle}>
            <h3 style={{ marginBottom: '1rem', textTransform: 'lowercase' }}>
              simple process
            </h3>
            <p style={{ textTransform: 'lowercase' }}>
              sign up with your brandeis email, get your match details via
              email, and show your color.
            </p>
          </div>
        </div>
      </section>

      {/* Modal Overlay */}
      {modalOpen && (
        <div
          className="modalOverlay active"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <div
            className="modal"
            style={{
              background: '#fff',
              borderRadius: 20,
              padding: '3rem',
              maxWidth: 600,
              maxHeight: '90%',
              overflowY: 'auto',
              width: '90%',
              boxShadow: '0 0 20px rgba(0,56,101,0.1)',
              textTransform: 'lowercase',
              animation: 'fadeIn 0.8s forwards',
              position: 'relative',
            }}
          >
            <button
              className="close-button"
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                color: '#003865',
                cursor: 'pointer',
              }}
            >
              &times;
            </button>
            <div
              style={{
                textAlign: 'center',
                marginBottom: '2rem',
                fontSize: '1.5rem',
              }}
            >
              sign up
            </div>

            {/* STEP 1 */}
            {currentStep === 1 && (
              <div style={{ animation: 'fadeIn 0.8s forwards' }}>
                <div style={{ marginBottom: '1.2rem' }}>
                  <label style={labelStyle}>name:</label>
                  <input
                    type="text"
                    style={inputStyle}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div style={{ marginBottom: '1.2rem' }}>
                  <label style={labelStyle}>brandeis email:</label>
                  <input
                    type="email"
                    style={inputStyle}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div style={{ marginBottom: '1.2rem' }}>
                  <label style={labelStyle}>
                    create password (min 6 chars):
                  </label>
                  <input
                    type="password"
                    style={inputStyle}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div style={{ marginBottom: '1.2rem' }}>
                  <label style={labelStyle}>confirm password:</label>
                  <input
                    type="password"
                    style={inputStyle}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: '1.5rem',
                  }}
                >
                  <button onClick={goToStep2} style={btnStyle}>
                    next
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {currentStep === 2 && (
              <div>
                <div style={{ marginBottom: '1.2rem' }}>
                  <label style={labelStyle}>choose your major(s):</label>
                  <div style={bubbleContainerStyle}>
                    {[
                      'computer science',
                      'biology',
                      'economics',
                      'history',
                      'sociology',
                      'music',
                      'business',
                      'psychology',
                      'hssp',
                      'english',
                      'education',
                    ].map((major) => (
                      <div
                        key={major}
                        style={{
                          ...bubbleStyle,
                          ...(selectedMajors.includes(major)
                            ? bubbleSelectedStyle
                            : {}),
                        }}
                        onClick={() =>
                          toggleSelection(
                            selectedMajors,
                            setSelectedMajors,
                            major
                          )
                        }
                      >
                        {major}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: '1.2rem' }}>
                  <label style={labelStyle}>class level:</label>
                  <div style={bubbleContainerStyle}>
                    {[
                      'freshman',
                      'sophomore',
                      'junior',
                      'senior',
                      'graduate',
                    ].map((level) => (
                      <div
                        key={level}
                        style={{
                          ...bubbleStyle,
                          ...(classLevel === level ? bubbleSelectedStyle : {}),
                        }}
                        onClick={() => setClassLevel(level)}
                      >
                        {level}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: '1.2rem' }}>
                  <label style={labelStyle}>select interests:</label>
                  <div style={bubbleContainerStyle}>
                    {[
                      'sports',
                      'art',
                      'movies',
                      'hiking',
                      'reading',
                      'volunteering',
                      'gaming',
                      'music',
                      'dance',
                      'cooking',
                      'photography',
                      'theater',
                      'science fiction',
                      'travel',
                      'politics',
                      'poetry',
                    ].map((interest) => (
                      <div
                        key={interest}
                        style={{
                          ...bubbleStyle,
                          ...(selectedInterests.includes(interest)
                            ? bubbleSelectedStyle
                            : {}),
                        }}
                        onClick={() =>
                          toggleSelection(
                            selectedInterests,
                            setSelectedInterests,
                            interest
                          )
                        }
                      >
                        {interest}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={buttonsRowStyle}>
                  <button onClick={goBackToStep1} style={btnStyle}>
                    back
                  </button>
                  <button onClick={goToStep3} style={btnStyle}>
                    next
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {currentStep === 3 && (
              <div>
                <div style={{ marginBottom: '1.2rem' }}>
                  <label style={labelStyle}>do you have a meal plan?</label>
                  <div style={bubbleContainerStyle}>
                    <div
                      style={{
                        ...bubbleStyle,
                        ...(mealPlan ? bubbleSelectedStyle : {}),
                      }}
                      onClick={() => setMealPlan(true)}
                    >
                      yes
                    </div>
                    <div
                      style={{
                        ...bubbleStyle,
                        ...(!mealPlan ? bubbleSelectedStyle : {}),
                      }}
                      onClick={() => setMealPlan(false)}
                    >
                      no
                    </div>
                  </div>
                </div>
                {mealPlan && (
                  <div style={{ marginBottom: '1.2rem' }}>
                    <label style={labelStyle}>
                      would you give your match a guest swipe?
                    </label>
                    <div style={bubbleContainerStyle}>
                      <div
                        style={{
                          ...bubbleStyle,
                          ...(guestSwipe ? bubbleSelectedStyle : {}),
                        }}
                        onClick={() => setGuestSwipe(true)}
                      >
                        yes
                      </div>
                      <div
                        style={{
                          ...bubbleStyle,
                          ...(!guestSwipe ? bubbleSelectedStyle : {}),
                        }}
                        onClick={() => setGuestSwipe(false)}
                      >
                        no
                      </div>
                    </div>
                  </div>
                )}
                <div style={{ marginBottom: '1.2rem' }}>
                  <label style={labelStyle}>preferred dining locations:</label>
                  <div style={bubbleContainerStyle}>
                    {[
                      'sherman',
                      'usdan',
                      'einstein’s',
                      'la sabrosa',
                      'stein',
                    ].map((loc) => (
                      <div
                        key={loc}
                        style={{
                          ...bubbleStyle,
                          ...(selectedLocations.includes(loc)
                            ? bubbleSelectedStyle
                            : {}),
                        }}
                        onClick={() =>
                          toggleSelection(
                            selectedLocations,
                            setSelectedLocations,
                            loc
                          )
                        }
                      >
                        {loc}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: '1.2rem' }}>
                  <label style={labelStyle}>select meal times</label>
                  <p style={{ fontSize: '0.85rem', marginTop: '-0.5rem' }}>
                    hover on a day to view breakfast, lunch, dinner times. click
                    to select.
                  </p>
                  <div
                    style={{
                      ...bubbleContainerStyle,
                      justifyContent: 'center',
                    }}
                  >
                    {[
                      'monday',
                      'tuesday',
                      'wednesday',
                      'thursday',
                      'friday',
                      'saturday',
                      'sunday',
                    ].map((day) => (
                      <div
                        key={day}
                        style={{
                          ...bubbleStyle,
                          ...(selectedDay === day ? bubbleSelectedStyle : {}),
                        }}
                        onClick={() =>
                          setSelectedDay(selectedDay === day ? null : day)
                        }
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                  {/* Show times for selectedDay */}
                  {selectedDay && (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        margin: '1rem auto',
                        width: '100%',
                        maxWidth: 600,
                      }}
                    >
                      {['breakfast', 'lunch', 'dinner'].map((meal) => (
                        <div
                          key={meal}
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            gap: '0.5rem',
                          }}
                        >
                          <h4
                            style={{
                              width: '100%',
                              fontSize: '1rem',
                              margin: '0.5rem 0',
                            }}
                          >
                            {meal}
                          </h4>
                          {[
                            '7:00-7:30 am',
                            '7:30-8:00 am',
                            '8:00-8:30 am',
                            '8:30-9:00 am',
                            '9:00-9:30 am',
                            '9:30-10:00 am',
                            '11:00-11:30 am',
                            '11:30-12:00 pm',
                            '12:00-12:30 pm',
                            '12:30-1:00 pm',
                            '1:00-1:30 pm',
                            '1:30-2:00 pm',
                            '5:00-5:30 pm',
                            '5:30-6:00 pm',
                            '6:00-6:30 pm',
                            '6:30-7:00 pm',
                            '7:00-7:30 pm',
                            '7:30-8:00 pm',
                            '8:00-8:30 pm',
                            '8:30-9:00 pm',
                            '9:00-9:30 pm',
                            '9:30-10:00 pm',
                          ]
                            // Filter times relevant to meal
                            .filter((time) => {
                              if (meal === 'breakfast') {
                                return (
                                  time.includes('am') &&
                                  !time.includes('11') &&
                                  !time.includes('12')
                                );
                              } else if (meal === 'lunch') {
                                return (
                                  time.includes('11:') ||
                                  time.includes('12:') ||
                                  time.includes('1:') ||
                                  time.includes('2:')
                                );
                              } else if (meal === 'dinner') {
                                return (
                                  time.includes('5:') ||
                                  time.includes('6:') ||
                                  time.includes('7:') ||
                                  time.includes('8:') ||
                                  time.includes('9:')
                                );
                              }
                              return false;
                            })
                            .map((time) => (
                              <div
                                key={time}
                                style={{
                                  ...bubbleStyle,
                                  ...(mealTimes[selectedDay][meal].includes(
                                    time
                                  )
                                    ? bubbleSelectedStyle
                                    : {}),
                                }}
                                onClick={() => {
                                  // Toggle time in mealTimes
                                  const alreadySelected =
                                    mealTimes[selectedDay][meal].includes(time);
                                  setMealTimes({
                                    ...mealTimes,
                                    [selectedDay]: {
                                      ...mealTimes[selectedDay],
                                      [meal]: alreadySelected
                                        ? mealTimes[selectedDay][meal].filter(
                                            (t) => t !== time
                                          )
                                        : [
                                            ...mealTimes[selectedDay][meal],
                                            time,
                                          ],
                                    },
                                  });
                                }}
                              >
                                {time}
                              </div>
                            ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div style={buttonsRowStyle}>
                  <button onClick={goBackToStep2} style={btnStyle}>
                    back
                  </button>
                  <button
                    onClick={handleSubmit}
                    style={btnStyle}
                    disabled={loading}
                  >
                    {loading ? 'submitting...' : 'sign up'}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: SUCCESS */}
            {currentStep === 4 && signUpSuccess && (
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.5rem' }}>success!</h2>
                <p style={{ marginTop: '1rem' }}>
                  thank you for signing up. keep an eye on your brandeis email
                  for your random meal match time, location, and the color to
                  show!
                </p>
                <div
                  style={{
                    marginTop: '1rem',
                    width: 100,
                    height: 150,
                    backgroundColor: '#003865',
                    margin: '1rem auto',
                    borderRadius: 10,
                  }}
                ></div>
                <p>
                  (this box simulates the color you will display on your phone.)
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------
// STYLES
// ---------------------------
const navLinkStyle = {
  textDecoration: 'none',
  color: '#003865',
  fontSize: '1rem',
  transition: 'color 0.3s',
};
const featureCardStyle = {
  background: '#fff',
  borderRadius: '1rem',
  padding: '2rem',
  boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
  textAlign: 'center',
  transition: 'transform 0.3s',
};
const labelStyle = {
  display: 'block',
  marginBottom: '0.5rem',
  fontWeight: 'bold',
  color: '#003865',
};
const inputStyle = {
  width: '100%',
  padding: '0.7rem',
  fontSize: '1rem',
  border: '1px solid #cccccc',
  borderRadius: 4,
  fontFamily: '"Courier New", Courier, monospace',
};
const btnStyle = {
  padding: '0.7rem 2rem',
  backgroundColor: '#003865',
  border: 'none',
  color: '#fff',
  borderRadius: 30,
  cursor: 'pointer',
  fontSize: '1rem',
  transition: 'background-color 0.3s ease',
  fontFamily: '"Courier New", Courier, monospace',
  textTransform: 'lowercase',
  marginLeft: '0.5rem',
};
const bubbleStyle = {
  cursor: 'pointer',
  padding: '0.5rem 1rem',
  borderRadius: 20,
  backgroundColor: '#fff',
  border: '2px solid #003865',
  color: '#003865',
  transition: 'all 0.3s ease',
  userSelect: 'none',
  fontSize: '0.9rem',
  marginBottom: '0.5rem',
};
const bubbleSelectedStyle = {
  backgroundColor: '#003865',
  color: '#fff',
};
const bubbleContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
};
const buttonsRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '1.5rem',
};
