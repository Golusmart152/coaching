const SettingsPage = ({ navigateTo, showMessage }) => {
    
    const SettingsCard = ({ title, description, icon, bgColor, targetPage, actions }) => (
        <div
            onClick={() => navigateTo(`/${targetPage}`)}
            className={`${bgColor} p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col items-start text-left`}
        >
            <div className="flex items-center mb-3">
                <span className="text-3xl mr-3">{icon}</span>
                <h3 className="text-xl font-bold text-gray-800">{title}</h3>
            </div>
            <p className="text-gray-700 mb-4 text-sm leading-relaxed">{description}</p>
            <div className="flex flex-col space-y-2 w-full">
                {actions.map((action, index) => (
                    <button
                        key={index}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigateTo(`/${action.target}`);
                        }}
                        className="text-blue-700 hover:text-blue-900 font-semibold text-left hover:underline transition-colors duration-200 text-sm"
                    >
                        {action.text} &rarr;
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <PageContainer title="Administrative Settings">
            <p className="text-gray-600 mb-8 text-center md:text-left">
                Manage your institute's configuration, user permissions, and system settings from this central dashboard.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <SettingsCard
                    title="User Management"
                    description="Manage user accounts, roles, and granular permissions for different modules and features."
                    icon="👥"
                    bgColor="bg-blue-200"
                    targetPage="user-management"
                    actions={[
                        { text: 'Manage User Accounts', target: 'user-management' },
                        { text: 'Configure Permissions', target: 'user-management' },
                        { text: 'Role Assignment', target: 'user-management' }
                    ]}
                />
                
                <SettingsCard
                    title="Teacher Management"
                    description="Dedicated management for teaching staff including course allotments and teacher-specific features."
                    icon="👨‍🏫"
                    bgColor="bg-green-200"
                    targetPage="teacher-management"
                    actions={[
                        { text: 'Teacher Directory', target: 'teacher-management' },
                        { text: 'Course Allotment', target: 'teacher-management' },
                        { text: 'Teacher Dashboard Config', target: 'teacher-management' }
                    ]}
                />
                
                <SettingsCard
                    title="Institute Details"
                    description="Manage your institute's branding, contact information, and organizational details."
                    icon="🏫"
                    bgColor="bg-purple-200"
                    targetPage="instituteDetails"
                    actions={[
                        { text: 'Edit Institute Info', target: 'instituteDetails' },
                        { text: 'Update Contact Details', target: 'instituteDetails' },
                        { text: 'Branding Settings', target: 'instituteDetails' }
                    ]}
                />
                
                <SettingsCard
                    title="Data Management"
                    description="Handle data backups, imports, exports, and system data maintenance operations."
                    icon="💾"
                    bgColor="bg-yellow-200"
                    targetPage="data-management"
                    actions={[
                        { text: 'Backup Data', target: 'data-management' },
                        { text: 'Import/Export', target: 'data-management' },
                        { text: 'Data Cleanup', target: 'data-management' }
                    ]}
                />
                
                <SettingsCard
                    title="Appearance Settings"
                    description="Customize the user interface, themes, and visual preferences for your application."
                    icon="🎨"
                    bgColor="bg-pink-200"
                    targetPage="appearance-settings"
                    actions={[
                        { text: 'Theme Settings', target: 'appearance-settings' },
                        { text: 'Layout Options', target: 'appearance-settings' },
                        { text: 'UI Preferences', target: 'appearance-settings' }
                    ]}
                />
                
                <SettingsCard
                    title="System Settings"
                    description="Configure system-wide settings, notifications, and application behavior preferences."
                    icon="⚙️"
                    bgColor="bg-indigo-200"
                    targetPage="system-settings"
                    actions={[
                        { text: 'General Settings', target: 'system-settings' },
                        { text: 'Notification Config', target: 'system-settings' },
                        { text: 'Security Settings', target: 'system-settings' }
                    ]}
                />
            </div>

            <div className="mt-8 p-6 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">🔒 Access Control Note</h4>
                <p className="text-gray-600 text-sm">
                    Administrative settings require appropriate permissions. Some features may be restricted based on your user role. 
                    Contact your system administrator if you need access to specific settings.
                </p>
            </div>
        </PageContainer>
    );
};